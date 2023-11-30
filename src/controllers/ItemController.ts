import { AnyFolder, IDashboard, IFolder, IItem, ILink, IUser } from "../models/User";
import { removeItemInPlace } from "../utils/removeItemInPlace";
import { reorderArray } from "../utils/reorderArray";
import { validateLink } from "../utils/validators/validateLink";
import { validateFolder } from "../utils/validators/validateFolder";
import { sanitizeItem } from "../utils/sanitizers/sanitizeItem";
import DashboardController from "./DashboardController";
import { FOLDER_SEPARATOR } from "../constants";

type ItemLocation = string[];
type ItemPath = string;

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
    validateLink(itemData);
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
  delete updatedItemData._id;

  if ("items" in updatedItemData) {
    delete updatedItemData.items;
  }

  const updatedItem = Object.assign({ ...item }, updatedItemData);
  const parentItems = parentFolder.items;

  if (ItemController.isLink(updatedItem)) {
    validateLink(updatedItem);
  }

  const itemIndex = parentItems.findIndex((thisItem) => {
    return ItemController.checkId(thisItem, updatedItem._id);
  });

  parentFolder.items[itemIndex] = updatedItem;
  return updatedItem;
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

  static getFolderByPath(user: IUser, path: string) {
    for (let dashboard of user.dashboards) {
      const location = this.getLocationFromPath(path);
      const folder = this.getFolderFromLocation(location, dashboard.tree);

      if (folder) {
        return folder;
      }
    }

    throw new Error("Item not found");
  }

  static getWithLocation(user: IUser, predicate: (item: IItem) => boolean) {
    for (let dashboard of user.dashboards) {
      let root: IFolder = {
        name: dashboard.name,
        items: dashboard.tree.items,
        _id: dashboard.tree._id,
      }

      const location: ItemLocation = [root.name];

      if (predicate(root)) {
        return { item: root, location };
      }

      const search = ({ items }: IFolder): IItem | null => {
        for (let item of items) {
          let addedName = false;

          if (this.isFolder(item)) {
            location.push(item.name);
            addedName = true
          }

          if (predicate(item)) {
            return item;
          }

          let found = this.isFolder(item) ? search(item) : null;

          if (found) {
            return found;
          }

          if (addedName) {
            location.pop();
          }
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

  private static getFolderFromLocation(location: ItemLocation, root: AnyFolder): AnyFolder | null {
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

  private static getLocationFromPath(path: ItemPath, separator = FOLDER_SEPARATOR): ItemLocation {
    return path === "" ? [] : path.split(separator);
  }
}

export default ItemController;
