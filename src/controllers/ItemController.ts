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
type ItemWithData = {
  item: IItem;
  type: "folder" | "link";
  dashboard: IDashboard;
  parent: AnyFolder | null;
  path: ItemPath;
  location: ItemLocation;
}

const getFolderOrThrowError = (user: IUser, id: string) => {
  const folder = ItemController.getById(user, id).item as IFolder | undefined;

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
  let itemWithData = ItemController.getById(user, id);

  if (!itemWithData) {
    throw new Error("Item not found");
  }

  const item = itemWithData.item;
  const parent = itemWithData.parent as any;

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
    const itemWithData = this.getWithData(user, id);

    if (!itemWithData) {
      throw new Error("Item not found");
    }

    return itemWithData;
  }

  static getFolderByPath(dashboard: IDashboard, path: string) {
    const location = this.getLocationByPath(path);
    const folder = this.getFolderByLocation(location, dashboard);

    if (folder) {
      return folder;
    }

    throw new Error("Item not found");
  }

  static getWithData(user: IUser, id: string): ItemWithData | null {
    const predicate = (item: IItem) => this.checkId(item, id);
    let itemWithData: any = null;
    let itemDashboard: any = null;
    let itemParent: any = null;

    for (let dashboard of user.dashboards) {
      let root: IFolder = {
        name: dashboard.name,
        items: dashboard.tree.items,
        _id: dashboard.tree._id,
      }

      const location: ItemLocation = [root.name];

      if (predicate(root)) {
        itemDashboard = dashboard;
        itemWithData = { item: root, location };
        break;
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

          let found;

          if (this.isFolder(item)) {
            found = search(item);
            if (found) {
              itemParent = item;
            }
          }

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

      if (item) {
        location.shift();
        itemWithData = { item, location };
        if (!itemParent) {
          itemParent = root;
        }
        itemParent = { ...itemParent };
        itemDashboard = dashboard;
        delete itemParent.name;
      }

      break;
    }

    if (itemWithData) {
      itemWithData.path = this.getPathByLocation(itemWithData.location);
      itemWithData.type = this.isFolder(itemWithData.item) ? "folder" : "link";
      itemWithData.dashboard = itemDashboard;
      itemWithData.parent = itemParent;
    }

    return itemWithData;
  }

  static async update(user: IUser, dashboard: IDashboard, id: string, updatedItemData: Partial<ILink>) {
    let itemWithData = this.getWithData(user, id);

    if (!itemWithData) {
      throw new Error("Item not found");
    }

    let { item, parent: parentFolder } = itemWithData;

    const dashboardIndex = DashboardController.getIndex(user, dashboard);

    if (!parentFolder) {
      if (this.isLink(item)) {
        throw new Error("Folder not found");
      } else {
        throw new Error("Cannot update root folder");
      }
    }

    item = update(item, parentFolder as any, updatedItemData);

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

  static getParent(user: IUser, id: string): IFolder | null {
    const parent = this.getWithData(user, id)?.parent;
    return (parent as any) ?? null;
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

  private static getFolderByLocation(location: ItemLocation, dashboard: IDashboard): ItemWithData | null {
    let targetFolder = dashboard.tree;
    let parent: any = null;

    let targetFolderWithData: any = {
      type: "folder",
      dashboard: dashboard,
      path: this.getPathByLocation([...location]),
      location: [...location],
    }

    while (location.length > 0) {
      const folderName = location[0];

      parent = targetFolder;
      targetFolder = targetFolder.items.find((item) => {
        return this.isFolder(item) && item.name === folderName;
      }) as IFolder;

      if (!targetFolder) {
        return null;
      }

      location.shift();
    }

    if (parent === targetFolder) {
      parent = null;
    }

    targetFolderWithData = {
      ...targetFolderWithData,
      item: targetFolder,
      parent,
    }

    return targetFolderWithData;
  }

  private static getLocationByPath(path: ItemPath, separator = FOLDER_SEPARATOR): ItemLocation {
    return path === "" ? [] : path.split(separator).filter((name) => name !== "");
  }

  private static getPathByLocation(location: ItemLocation, separator = FOLDER_SEPARATOR): ItemPath {
    return location.join(separator);
  }
}

export default ItemController;
