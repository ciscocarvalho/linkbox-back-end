import { AnyFolder, IDashboard, IFolder, IItem, ILink, IUser } from "../Model/User";
import { removeItemInPlace } from "../util/removeItemInPlace";
import { reorderArray } from "../util/reorderArray";
import { validateLink } from "../util/validators/validateLink";
import { validateFolder } from "../util/validators/validateFolder";
import { sanitizeItem } from "../util/sanitizers/sanitizeItem";
import DashboardController from "./DashboardController";
import { FOLDER_SEPARATOR } from "../constants";

const getFolderOrThrowError = (user: IUser, id: string) => {
  const folder = ItemController.getWithPath(user, id)?.item as IFolder | undefined;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return folder;
}

const add = async (user: IUser, dashboard: IDashboard, itemData: IItem, parentId: string) => {
  const dashboardIndex = DashboardController.getIndex(user, dashboard);
  const parentFolder = getFolderOrThrowError(user, parentId);

  if (ItemController.isLink(itemData)) {
    validateLink(parentFolder, itemData);
  } else {
    validateFolder(parentFolder, itemData);
  }

  parentFolder.items.push(itemData);
  user.dashboards[dashboardIndex] = dashboard;
}

const removeLink = (item: IItem, parent: IFolder) => {
  removeItemInPlace(parent.items, item);
}

const removeFolder = (item: IItem, parent: IFolder | null, dashboard: IDashboard) => {
  if (parent) {
    removeItemInPlace(parent.items, item);
  } else {
    dashboard.tree.items = [];
  }
}

const remove = (user: IUser, dashboard: IDashboard, id: string) => {
  const dashboardIndex = DashboardController.getIndex(user, dashboard);
  const parent = ItemController.getParent(user, id);
  let item = ItemController.getById(user, id);

  if (!item) {
    throw new Error("Item not found");
  }

  if (ItemController.isLink(item)) {
    removeLink(item, parent!);
  } else {
    removeFolder(item, parent, dashboard);
  }

  user.dashboards[dashboardIndex] = dashboard;

  return item;
}

const update = <T extends IItem>(item: T, parentFolder: IFolder, updatedItemData: Partial<T>) => {
  let itemIndex;
  const updatedItem = Object.assign({ ...item }, updatedItemData);
  const parentItems = parentFolder.items;

  if (ItemController.isLink(updatedItem)) {
    validateLink(parentFolder, updatedItem);

    itemIndex = parentItems.findIndex((thisItem) => {
      return ItemController.isLink(thisItem) && thisItem._id === item._id;
    });
  } else {
    itemIndex = parentItems.findIndex((thisItem) => {
      return ItemController.isFolder(thisItem) && thisItem.name === updatedItem.name;
    });
  }

  delete updatedItemData._id;

  parentFolder.items[itemIndex] = updatedItem;
  return item;
}

class ItemController {
  static async create(user: IUser, dashboard: IDashboard, itemData: IItem, parentId: string) {
    itemData = sanitizeItem(itemData);
    add(user, dashboard, itemData, parentId);
    await user.save();
    return itemData;
  }

  static getById(user: IUser, id: string) {
    const itemWithPath = id ? this.getWithPath(user, id) : null;
    const item = itemWithPath?.item;

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  static getByPath(user: IUser, path: string) {
    const folder = this.getFolderByPath(user, path);

    if (folder) {
      return folder;
    }

    const link = this.getLinkByPath(user, path);

    if (link) {
      return link;
    }
  }

  static getWithLocation(user: IUser, predicate: (item: IItem) => boolean) {
    for (let dashboard of user.dashboards) {
      let root: IFolder = {
        name: dashboard.name,
        items: dashboard.tree.items,
        _id: dashboard.tree._id,
      }

      const location: Location = [root.name];

      if (predicate(root)) {
        return { item: root, location };
      }

      const search = ({ items }: IFolder): IItem | null => {
        for (let item of items) {
          const itemLabel = this.getItemLabel(item);
          location.push(itemLabel);

          if (predicate(item)) {
            return item;
          }

          let found = this.isFolder(item) ? search(item) : null;

          if (found) {
            return found;
          }

          location.pop();
        }

        return null;
      };

      const item = search(root);
      return item ? { item, location } : null;
    }

    return null;
  };

  static getWithPath(user: IUser, id: string) {
    const itemWithLocation = this.getWithLocation(
      user,
      (item: IItem) => this.checkId(item, id)
    );

    if (!itemWithLocation) {
      return null;
    }

    itemWithLocation.location = itemWithLocation.location.slice(1);
    const path = itemWithLocation.location.join("/");
    return { item: itemWithLocation.item, path };
  };

  static async update(user: IUser, dashboard: IDashboard, id: string, updatedItemData: Partial<ILink>) {
    let item = this.getById(user, id);
    const parentFolder = this.getParent(user, item._id);
    const dashboardIndex = DashboardController.getIndex(user, dashboard);

    if (!parentFolder) {
      if (this.isLink(item)) {
        throw new Error("Folder not found");
      } else {
        throw new Error("Cannot update root folder");
      }
    }

    item = update(item, parentFolder, updatedItemData);

    user.dashboards[dashboardIndex] = dashboard;
    await user.save();
    return item;
  }

  static async move(user: IUser, dashboard: IDashboard, id: string, parentId: string) {
    const item = remove(user, dashboard, id);
    await add(user, dashboard, item, parentId);
    await user.save();
    return item;
  }

  static async delete(user: IUser, dashboard: IDashboard, id: string) {
    const item = remove(user, dashboard, id);
    await user.save();
    return item;
  }

  static async reposition(
    user: IUser,
    dashboard: IDashboard,
    parentId: string,
    currentIndex: number,
    newIndex: number,
    strategy?: "before" | "after",
  ) {
    const dashboardIndex = DashboardController.getIndex(user, dashboard);
    const folder = getFolderOrThrowError(user, parentId);

    reorderArray(folder.items, currentIndex, newIndex, strategy);

    user.dashboards[dashboardIndex] = dashboard;
    await user.save();

    return folder;
  }

  static getParent(user: IUser, id: string) {
    const parentWithLocation = this.getWithLocation(user, (parent) => {
      if (!this.isFolder(parent)) {
        return false;
      }

      return !!parent.items.find(child => this.checkId(child, id));
    });

    const parent = parentWithLocation?.item as IFolder | undefined;
    return parent ?? null;
  }

  static checkId(item: IItem, id: string) {
    return item._id.toString() === id;
  }

  static isFolder(item: any): item is AnyFolder {
    return "items" in item;
  }

  static isLink(item: any): item is ILink {
    return "url" in item;
  }

  private static getFolderFromLocation(location: Location, root: AnyFolder): AnyFolder | null {
    let targetFolder = root;

    while (location.length > 0) {
      const folderName = location[0];

      targetFolder = targetFolder.items.find((item) => {
        return "name" in item && item.name === folderName;
      }) as IFolder;

      if (!targetFolder) {
        return null;
      }

      location.shift();
    }

    return targetFolder;
  }

  private static getFolderFromLocationOrThrowError(dashboard: IDashboard, location: Location) {
    const folder = this.getFolderFromLocation(location, dashboard.tree);

    if (!folder) {
      throw new Error("Folder not found");
    }

    return folder as AnyFolder;
  }

  private static getLinkUrlFromLocation(linkLocation: Location) {
    let url = linkLocation[linkLocation.length - 1];

    if (!url) {
      return null;
    }

    return decodeURIComponent(url);
  }

  private static getLinkFromLocationOrThrowError(dashboard: IDashboard, location: Location) {
    const parentLocation = location.slice(0, location.length - 1);
    const parentFolder = this.getFolderFromLocationOrThrowError(dashboard, parentLocation);
    const url = this.getLinkUrlFromLocation(location);

    if (url === null) {
      throw new Error("Link not found");
    }

    const { items } = parentFolder;

    const linkIndex = items.findIndex((item) => {
      return ItemController.isLink(item) && item.url === url;
    });

    const link = items[linkIndex] as ILink | undefined;

    if (!link) {
      throw new Error("Link not found");
    }

    return { link, linkIndex };
  }

  private static getLocationFromPath(path: Path, separator = FOLDER_SEPARATOR): Location {
    return path === "" ? [] : path.split(separator);
  }

  private static getFolderByPath(user: IUser, path: string) {
    for (let dashboard of user.dashboards) {
      const location = this.getLocationFromPath(path);
      return this.getFolderFromLocationOrThrowError(dashboard, location);
    }
  }

  private static getLinkByPath(user: IUser, path: string) {
    for (let dashboard of user.dashboards) {
      const location = this.getLocationFromPath(path);
      return this.getLinkFromLocationOrThrowError(dashboard, location).link;
    }
  }

  private static getItemLabel(item: IItem) {
    if (this.isFolder(item)) {
      return item.name;
    }

    return encodeURIComponent(item.url);
  }
}

export default ItemController;
