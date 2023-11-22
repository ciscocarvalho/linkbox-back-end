import { ObjectId } from "mongodb";
import { AnyFolder, IDashboard, IFolder, IUser } from "../Model/User";
import { getDashboardIndex, getFolderByPath, getFolderOrThrowError } from "../util/controller";
import { getLocationFromPath, getParentFolderFromPath, getParentLocation, isFolder } from "../util/util";

const folderNameIsAlreadyUsed = (parent: AnyFolder, name: string) => {
  return !!parent.items.find((item) => isFolder(item) && item.name === name);
}

const add = async (user: IUser, dashboard: IDashboard, folderData: IFolder, path: string) => {
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const location = getLocationFromPath(path);
  const destinationFolder = getFolderOrThrowError(dashboard, location).folder;

  if (folderNameIsAlreadyUsed(destinationFolder, folderData.name)) {
    throw new Error("Folder name already used");
  }

  if (!folderData.items) {
    folderData.items = [];
  }

  destinationFolder.items.push(folderData);

  user.dashboards[dashboardIndex] = dashboard;
}

const remove = async (user: IUser, dashboard: IDashboard, path: string) => {
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const root = dashboard.tree;
  const parentFolder = getParentFolderFromPath(path, root)

  const location = getLocationFromPath(path);
  const folder = getFolderOrThrowError(dashboard, location).folder;

  if (parentFolder) {
    parentFolder.items = parentFolder.items.filter((item) => item !== folder);
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
  static async create(user: IUser, dashboard: IDashboard, folderData: IFolder, path: string) {
    if (!isFolderNameValid(folderData.name)) {
      throw new Error("Invalid folder name");
    }

    folderData = addIdsToFolderAndItems(folderData);
    await add(user, dashboard, folderData, path);
    await user.save();
    return folderData;
  }

  static getByPath(dashboard: IDashboard, path: string) {
    return getFolderByPath(dashboard, path);
  }

  static async update(user: IUser, dashboard: IDashboard, path: string, updatedFolderData: Partial<IFolder>) {
    const dashboardIndex = getDashboardIndex(user, dashboard);
    const location = getLocationFromPath(path);
    const parentLocation = getParentLocation(location);
    const parentFolder = getFolderOrThrowError(dashboard, parentLocation).folder;
    const folderName = location[location.length - 1];
    const parentItems = parentFolder.items;

    const folderIndex = parentItems.findIndex((item) => {
      return isFolder(item) && item.name === folderName;
    });

    const folder = parentItems[folderIndex];

    if (!folder) {
      throw new Error("Folder not found");
    }

    delete updatedFolderData._id;

    parentItems[folderIndex] = Object.assign(folder, updatedFolderData);
    user.dashboards[dashboardIndex] = dashboard;

    await user.save();
    return folder;
  }

  static async delete(user: IUser, dashboard: IDashboard, path: string) {
    const folder = await remove(user, dashboard, path);
    await user.save();
    return folder;
  }

  static async move(user: IUser, dashboard: IDashboard, path: string, targetPath: string) {
    const folder = await remove(user, dashboard, path) as IFolder;
    await add(user, dashboard, folder, targetPath);
    await user.save();
    return folder;
  }

  static async reposition(
    user: IUser,
    dashboard: IDashboard,
    path: string,
    currentIndex: number,
    newIndex: number,
    strategy?: "before" | "after",
  ) {
    const dashboardIndex = getDashboardIndex(user, dashboard);
    const location = getLocationFromPath(path);
    const folder = getFolderOrThrowError(dashboard, location).folder;

    reorderArray(folder.items, currentIndex, newIndex, strategy);

    user.dashboards[dashboardIndex] = dashboard;
    await user.save();

    return folder;
  }
}

export default FolderController;
