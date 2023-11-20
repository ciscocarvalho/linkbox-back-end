import { ObjectId } from "mongodb";
import { AnyFolder, IFolder, IUser } from "../Model/User";
import { getDashboardOrThrowError, getFolderOrThrowError, getUserOrThrowError } from "../util/controller";
import { getLocationFromPath, getParentFolderFromPath, getParentLocation, isFolder } from "../util/util";

const folderNameIsAlreadyUsed = (parent: AnyFolder, name: string) => {
  return !!parent.items.find((item) => isFolder(item) && item.name === name);
}

const add = async (user: IUser, dashboardName: string, folderData: IFolder, path: string) => {
  const { dashboard, dashboardIndex } = getDashboardOrThrowError(user, dashboardName);

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

const remove = async (user: IUser, dashboardName: string, path: string) => {
  const { dashboard, dashboardIndex } = getDashboardOrThrowError(user, dashboardName);

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

class FolderController {
  static async create(userId: string, dashboardName: string, folderData: IFolder, path: string) {
    const user = await getUserOrThrowError(userId);
    folderData = addIdsToFolderAndItems(folderData);
    await add(user, dashboardName, folderData, path);
    await user.save();
    return folderData;
  }

  static async getByPath(userId: string, dashboardName: string, path: string) {
    const user = await getUserOrThrowError(userId);
    const { dashboard } = getDashboardOrThrowError(user, dashboardName);
    const location = getLocationFromPath(path);
    const folder = getFolderOrThrowError(dashboard, location).folder;
    return folder;
  }

  static async update(userId: string, dashboardName: string, path: string, updatedFolderData: Partial<IFolder>) {
    const user = await getUserOrThrowError(userId);
    const { dashboard, dashboardIndex } = getDashboardOrThrowError(user, dashboardName);
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

  static async delete(userId: string, dashboardName: string, path: string) {
    const user = await getUserOrThrowError(userId);
    const folder = await remove(user, dashboardName, path);
    await user.save();
    return folder;
  }

  static async move(userId: string, dashboardName: string, path: string, targetPath: string) {
    const user = await getUserOrThrowError(userId);
    const folder = await remove(user, dashboardName, path) as IFolder;
    await add(user, dashboardName, folder, targetPath);
    await user.save();
    return folder;
  }

  static async reposition(
    userId: string,
    dashboardName: string,
    path: string,
    currentIndex: number,
    newIndex: number,
    strategy?: "before" | "after",
  ) {
    const user = await getUserOrThrowError(userId);
    const { dashboard, dashboardIndex } = getDashboardOrThrowError(user, dashboardName);

    const location = getLocationFromPath(path);
    const folder = getFolderOrThrowError(dashboard, location).folder;

    reorderArray(folder.items, currentIndex, newIndex, strategy);

    user.dashboards[dashboardIndex] = dashboard;
    await user.save();

    return folder;
  }
}

export default FolderController;
