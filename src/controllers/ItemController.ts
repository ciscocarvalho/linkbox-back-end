import { AnyFolder, IDashboard, IFolder, IItem, ILink, IUser } from "../models/User";
import { removeItemInPlace } from "../utils/removeItemInPlace";
import { reorderArray } from "../utils/reorderArray";
import DashboardController from "./DashboardController";
import { FOLDER_SEPARATOR } from "../constants";
import { FOLDER_NOT_FOUND, ITEM_NOT_FOUND, UNKNOWN_ERROR } from "../constants/responseErrors";
import { FolderValidator } from "../utils/validators/FolderValidator";
import { LinkValidator } from "../utils/validators/LinkValidator";
import { LinkSanitizer } from "../utils/sanitizers/LinkSanitizer";
import { FolderSanitizer } from "../utils/sanitizers/FolderSanitizer";

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
    throw FOLDER_NOT_FOUND;
  }

  return folder;
}

const add = async (user: IUser, dashboard: IDashboard, itemCandidate: IItem, parentId: string) => {
  const dashboardIndex = DashboardController.getIndex(user, dashboard);
  const parentFolder = getFolderOrThrowError(user, parentId);
  let validation;

  if (ItemController.isLink(itemCandidate)) {
    itemCandidate = LinkSanitizer.sanitizeCreation(itemCandidate) as ILink;
    validation = LinkValidator.validateCreation(itemCandidate);
  } else {
    itemCandidate = FolderSanitizer.sanitizeCreation(itemCandidate) as IFolder;
    validation = FolderValidator.validateCreation(parentFolder, itemCandidate);
  }

  if (validation.errors) {
    throw validation.errors;
  }

  parentFolder.items.push(itemCandidate);
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
    throw ITEM_NOT_FOUND;
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

const update = <T extends IItem>(item: T, parentFolder: IFolder, itemData: Partial<T>) => {
  const parentItems = parentFolder.items;
  let updatedItem: IItem | undefined;
  let validation;

  if (ItemController.isLink(item)) {
    itemData = LinkSanitizer.sanitizeUpdate(itemData) as any;
    validation = LinkValidator.validateUpdate(item, itemData);
    updatedItem = validation.data?.updatedLink;
  } else {
    itemData = FolderSanitizer.sanitizeUpdate(itemData) as any;
    validation = FolderValidator.validateUpdate(parentFolder, item, itemData);
    updatedItem = validation.data?.updatedFolder;
    console.log("updatedItem:", updatedItem);
  }

  if (validation.errors) {
    throw validation.errors;
  } else if (!updatedItem) {
    throw UNKNOWN_ERROR;
  }

  const itemIndex = parentItems.findIndex((thisItem) => {
    return ItemController.checkId(thisItem, updatedItem!._id);
  });

  parentFolder.items[itemIndex] = updatedItem;
  return updatedItem;
}

class ItemController {
  static async create(user: IUser, dashboard: IDashboard, itemCandidate: IItem, parentId: string) {
    await add(user, dashboard, itemCandidate, parentId);
    await user.save();
    return itemCandidate;
  }

  static getById(user: IUser, id: string) {
    const itemWithData = this.getWithData(user, id);

    if (!itemWithData) {
      throw ITEM_NOT_FOUND;
    }

    return itemWithData;
  }

  static getFolderByPath(dashboard: IDashboard, path: string) {
    const location = this.getLocationByPath(path);
    const folder = this.getFolderByLocation(location, dashboard);

    if (!folder) {
      throw FOLDER_NOT_FOUND;
    }

    return folder;
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

      const location: ItemLocation = [];

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
    const dashboardIndex = DashboardController.getIndex(user, dashboard);
    let itemWithData = this.getWithData(user, id);

    if (!itemWithData) {
      throw ITEM_NOT_FOUND;
    }

    let { item, parent: parentFolder } = itemWithData;
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
