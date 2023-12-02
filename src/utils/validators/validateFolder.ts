import { FOLDER_NAME_ALREADY_USED, INVALID_FOLDER_NAME } from "../../constants/responseErrors";
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
    throw INVALID_FOLDER_NAME;
  }

  if (folderNameIsAlreadyUsed(parent, folderData.name)) {
    throw FOLDER_NAME_ALREADY_USED;
  }
};
