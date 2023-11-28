import { ObjectId } from "mongodb";
import { IDashboard, IFolder, IItem, ILink, IUser } from "../Model/User";
import { getItemWithPath } from "../Routes/util/getItemWithPath";
import { getDashboardIndex, getItemParent } from "../util/controller";
import { isFolder } from "../util/isFolder";
import { isLink } from "../util/isLink";
import { removeItemInPlace } from "../util/removeItemInPlace";
import { reorderArray } from "../util/reorderArray";
import { validateLink } from "../util/validators/validateLink";
import { validateFolder } from "../util/validators/validateFolder";

export const getFolderOrThrowError = (user: IUser, id: string) => {
  const folder = getItemWithPath(user, id)?.item as IFolder | undefined;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return folder;
}

const prepareFolderData = (folderData: IFolder) => {
  if (!folderData.items) {
    folderData.items = [];
  }
}

export const add = async (user: IUser, dashboard: IDashboard, itemData: IItem, parentId: string) => {
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const parentFolder = getFolderOrThrowError(user, parentId);

  if (isLink(itemData)) {
    validateLink(parentFolder, itemData);
  } else {
    prepareFolderData(itemData);
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
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const parent = getItemParent(user, id);
  let item = ItemController.getById(user, id);

  if (!item) {
    throw new Error("Item not found");
  }

  if (isLink(item)) {
    removeLink(item, parent!);
  } else {
    removeFolder(item, parent, dashboard);
  }

  user.dashboards[dashboardIndex] = dashboard;

  return item;
}

const handleItemDataId = (itemData: IItem) => {
  itemData._id = new ObjectId().toString();

  if (!isFolder(itemData)) {
    return;
  }

  let items = [...itemData.items];

  while (items.length > 0) {
    const item = items.pop();

    if (item) {
      item._id = new ObjectId().toString();
    }

    if (isFolder(item)) {
      items = [...items, ...item.items];
    }
  }
}

const update = <T extends IItem>(item: T, parentFolder: IFolder, updatedItemData: Partial<T>) => {
  let itemIndex;
  const updatedItem = Object.assign({ ...item }, updatedItemData);
  const parentItems = parentFolder.items;

  if (isLink(updatedItem)) {
    validateLink(parentFolder, updatedItem);

    itemIndex = parentItems.findIndex((thisItem) => {
      return isLink(thisItem) && thisItem._id === item._id;
    });
  } else {
    itemIndex = parentItems.findIndex((thisItem) => {
      return isFolder(thisItem) && thisItem.name === updatedItem.name;
    });
  }

  delete updatedItemData._id;

  parentFolder.items[itemIndex] = updatedItem;
  return item;
}

class ItemController {
  static async create(user: IUser, dashboard: IDashboard, itemData: IItem, parentId: string) {
    handleItemDataId(itemData);
    add(user, dashboard, itemData, parentId);
    await user.save();
    return itemData;
  }

  static getById(user: IUser, id: string) {
    const itemWithPath = id ? getItemWithPath(user, id) : null;
    const item = itemWithPath?.item;

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  static async update(user: IUser, dashboard: IDashboard, id: string, updatedItemData: Partial<ILink>) {
    let item = ItemController.getById(user, id);
    const parentFolder = getItemParent(user, item._id);
    const dashboardIndex = getDashboardIndex(user, dashboard);

    if (!parentFolder) {
      if (isLink(item)) {
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
    const dashboardIndex = getDashboardIndex(user, dashboard);
    const folder = getFolderOrThrowError(user, parentId);

    reorderArray(folder.items, currentIndex, newIndex, strategy);

    user.dashboards[dashboardIndex] = dashboard;
    await user.save();

    return folder;
  }
}

export default ItemController;
