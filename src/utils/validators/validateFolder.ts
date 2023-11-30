import ItemController from "../../controllers/ItemController";
import { AnyFolder, IFolder } from "../../models/User";

const isFolderNameValid = (name: string) => {
  name = name.trim();
  return name && name.indexOf("/") === -1;
};

const folderNameIsAlreadyUsed = (parent: AnyFolder, name: string) => {
  return !!parent.items.find((item) => ItemController.isFolder(item) && item.name === name);
};

export const validateFolder = (parent: IFolder, folderData: IFolder) => {
  if (!isFolderNameValid(folderData.name)) {
    throw new Error("Invalid folder name");
  }

  if (folderNameIsAlreadyUsed(parent, folderData.name)) {
    throw new Error("Folder name already used");
  }
};
