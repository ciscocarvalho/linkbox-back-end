import { ObjectId } from "mongodb";
import { AnyFolder, IDashboard, IFolder, IUser } from "../Model/User";
import { getDashboardIndex, getFolderByPath, getItemParent } from "../util/controller";
import { isFolder, removeItemInPlace } from "../util/util";
import { getItemWithPath } from "../Routes/util/getItemWithPath";

const getFolderOrThrowError = (user: IUser, id: string) => {
  const folderWithPath = getItemWithPath(user, id);
  const folder = folderWithPath?.item as IFolder | undefined;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return folder;
}

const folderNameIsAlreadyUsed = (parent: AnyFolder, name: string) => {
  return !!parent.items.find((item) => isFolder(item) && item.name === name);
}

const add = async (user: IUser, dashboard: IDashboard, folderData: IFolder, parentId: string) => {
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const parentFolder = getFolderOrThrowError(user, parentId);

  if (folderNameIsAlreadyUsed(parentFolder, folderData.name)) {
    throw new Error("Folder name already used");
  }

  if (!folderData.items) {
    folderData.items = [];
  }

  parentFolder.items.push(folderData);

  user.dashboards[dashboardIndex] = dashboard;
}

const remove = async (user: IUser, dashboard: IDashboard, id: string) => {
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const folder = getFolderOrThrowError(user, id);
  const parentFolder = getItemParent(user, folder._id);

  if (parentFolder) {
    removeItemInPlace(parentFolder.items, folder);
  } else {
    dashboard.tree.items = [];
  }

  user.dashboards[dashboardIndex] = dashboard;

  return folder;
}

const swap = <T>(arr: T[], firstIndex: number, secondIndex: number) => {
    const firstItem = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = firstItem;
}

const moveToNewIndex = <T>(arr: T[], currentIndex: number, newIndex: number) => {
    if (currentIndex === newIndex) {
        return;
    }

    if (currentIndex > newIndex) {
        for (; currentIndex > newIndex; currentIndex--) {
            swap(arr, currentIndex, currentIndex - 1);
        }
    } else if (currentIndex < newIndex) {
        for (; currentIndex < newIndex; currentIndex++) {
            swap(arr, currentIndex, currentIndex + 1);
        }
    }
}

const reorderArray = <T>(arr: T[], currentIndex: number, newIndex: number, strategy: "before" | "after" = "after") => {
    if (!arr[currentIndex] || !arr[newIndex]) {
        return arr;
    }

    if (currentIndex > newIndex && strategy === "after") {
        newIndex = newIndex + 1;
    } else if (currentIndex < newIndex && strategy === "before") {
        newIndex = newIndex - 1;
    }

    moveToNewIndex(arr, currentIndex, newIndex);
};

const addIdsToFolderAndItems = (folder: IFolder) => {
  folder._id = new ObjectId().toString();

  let items = [...folder.items];

  while (items.length > 0) {
    const item = items.pop();

    if (item) {
      item._id = new ObjectId().toString();
    }

    if (isFolder(item)) {
      items = [...items, ...item.items];
    }
  }

  return folder;
}

const isFolderNameValid = (name: string) => {
  name = name.trim();
  return name && name.indexOf("/") === -1;
}

class FolderController {
  static async create(user: IUser, dashboard: IDashboard, folderData: IFolder, parentId: string) {
    if (!isFolderNameValid(folderData.name)) {
      throw new Error("Invalid folder name");
    }

    folderData = addIdsToFolderAndItems(folderData);
    await add(user, dashboard, folderData, parentId);
    await user.save();
    return folderData;
  }

  static getByPath(user: IUser, path: string) {
    return getFolderByPath(user, path);
  }

  static async update(user: IUser, dashboard: IDashboard, id: string, updatedFolderData: Partial<IFolder>) {
    const dashboardIndex = getDashboardIndex(user, dashboard);
    const folder = getFolderOrThrowError(user, id);
    const parentFolder = getItemParent(user, folder._id);

    if (!parentFolder) {
      throw new Error("Cannot update root folder");
    }

    const parentItems = parentFolder.items;

    const folderIndex = parentItems.findIndex((item) => {
      return isFolder(item) && item.name === folder.name;
    });

    delete updatedFolderData._id;

    parentFolder.items[folderIndex] = Object.assign(folder, updatedFolderData);
    user.dashboards[dashboardIndex] = dashboard;

    await user.save();
    return folder;
  }

  static async delete(user: IUser, dashboard: IDashboard, id: string) {
    const folder = await remove(user, dashboard, id);
    await user.save();
    return folder;
  }

  static async move(user: IUser, dashboard: IDashboard, id: string, parentId: string) {
    const folder = await remove(user, dashboard, id) as IFolder;
    await add(user, dashboard, folder, parentId);
    await user.save();
    return folder;
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

export default FolderController;
