import { AnyFolder, IFolder, ILink } from "../Model/User";

type Location = string[];
type Path = string;

export const FOLDER_SEPARATOR = "/";

export const getFolderFromLocation = (location: Location, root: AnyFolder): AnyFolder | null => {
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

export const getLocationFromPath = (path: Path, separator = FOLDER_SEPARATOR): Location => {
  return path === "" ? [] : path.split(separator);
}

export const getFolderFromPath = (path: Path, root: AnyFolder, separator = FOLDER_SEPARATOR) => {
  const location = getLocationFromPath(path, separator)
  return getFolderFromLocation(location, root);
}

export const getParentFolderFromLocation = (location: Location, root: AnyFolder, separator = FOLDER_SEPARATOR) => {
  const parentLocation = location.slice(0, location.length - 1);
  const parent = getFolderFromLocation(parentLocation, root);
  return parent;
}

export const getParentFolderFromPath = (path: Path, root: AnyFolder, separator = FOLDER_SEPARATOR) => {
  return getParentFolderFromLocation(getLocationFromPath(path, separator), root, separator);
}

export const isFolder = (item: any): item is AnyFolder => {
  return "items" in item;
}

export const isLink = (item: any): item is ILink => {
  return "url" in item;
}

export const getParentLocation = (location: Location): Location => {
  const parentLocation = location.slice(0, location.length - 1);
  return parentLocation;
}

export const removeIndexFromArray = <T>(arr: Array<T>, index: number) => {
  return arr.filter((_, thisIndex) => thisIndex !== index);
}
