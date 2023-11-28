import { AnyFolder, IFolder } from "../../Model/User";

type Location = string[];

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

