import { ObjectId } from "mongodb";
import { AnyFolder, IDashboard, IFolder, IItem, ILink, IUser } from "../Model/User";
import { getItemWithPath } from "../Routes/util/getItemWithPath";
import { getDashboardIndex, getItemParent } from "../util/controller";
import { isFolder, isLink, removeItemInPlace } from "../util/util";
import { reorderArray } from "../util/reorderArray";

export const getFolderOrThrowError = (user: IUser, id: string) => {
  const folder = getItemWithPath(user, id)?.item as IFolder | undefined;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return folder;
}

const isTitleValid = (title: string) => {
  return title.trim() !== "";
}

const isUrlValid = (url: string) => {
  return url.trim() !== "";
}

const validateLinkData = (parent: IFolder, linkData: ILink) => {
  if (!isUrlValid(linkData.url)) {
    throw new Error("Invalid link url");
  }

  if (!isTitleValid(linkData.title)) {
    throw new Error("Invalid link title");
  }

  if (linkUrlIsAlreadyUsed(parent, linkData.url)) {
    throw new Error("Link url already used");
  }
}

const folderNameIsAlreadyUsed = (parent: AnyFolder, name: string) => {
  return !!parent.items.find((item) => isFolder(item) && item.name === name);
}

const validateFolderData = (parent: IFolder, folderData: IFolder) => {
  if (folderNameIsAlreadyUsed(parent, folderData.name)) {
    throw new Error("Folder name already used");
  }
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
    validateLinkData(parentFolder, itemData);
  } else {
    prepareFolderData(itemData);
    validateFolderData(parentFolder, itemData);
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

const isFolderNameValid = (name: string) => {
  name = name.trim();
  return name && name.indexOf("/") === -1;
}

const validateItemData = (itemData: IItem) => {
  if (isFolder(itemData)) {
    if (!isFolderNameValid(itemData.name)) {
      throw new Error("Invalid folder name");
    }
  }
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

const linkUrlIsAlreadyUsed = (parent: AnyFolder, url: string) => {
  return !!parent.items.find((item) => isLink(item) && item.url === url);
}

const validateLinkDataForUpdate = (parentFolder: IFolder, updatedLinkData: Partial<ILink>) => {
  const newUrl = updatedLinkData.url;

  if (newUrl && linkUrlIsAlreadyUsed(parentFolder, newUrl)) {
    throw new Error("Link url already used");
  }
}

const update = (item: IItem, parentFolder: IFolder, updatedItemData: Partial<IItem>) => {
  let itemIndex;
  const parentItems = parentFolder.items;

  if (isLink(item)) {
    validateLinkDataForUpdate(parentFolder, updatedItemData);

    itemIndex = parentItems.findIndex((thisItem) => {
      return isLink(thisItem) && thisItem._id === item._id;
    });
  } else {
    itemIndex = parentItems.findIndex((thisItem) => {
      return isFolder(thisItem) && thisItem.name === item.name;
    });
  }


  delete updatedItemData._id;

  parentFolder.items[itemIndex] = Object.assign(item, updatedItemData);
  return item;
}

class ItemController {
  static async create(user: IUser, dashboard: IDashboard, itemData: IItem, parentId: string) {
    validateItemData(itemData);
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
