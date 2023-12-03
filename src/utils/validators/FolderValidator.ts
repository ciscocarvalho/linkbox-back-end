import { FOLDER_NAME_ALREADY_USED, FOLDER_NAME_IS_INVALID, FOLDER_NAME_IS_REQUIRED, ROOT_FOLDER_CANNOT_BE_UPDATED } from "../../constants/responseErrors";
import ItemController from "../../controllers/ItemController";
import { AnyFolder, IFolder } from "../../models/User";
import { betterAssign } from "../betterAssign";

export class FolderValidator {
  static validateCreation(parent: IFolder, folderCandidate: IFolder) {
    return this.validate(parent, folderCandidate);
  }

  static validateUpdate(
    parent: IFolder,
    folder: IFolder,
    folderData: Partial<IFolder>
  ) {
    let result;
    let updatedFolder;

    if (parent) {
      updatedFolder = betterAssign({ ...folder }, { ...folderData }) as IFolder;
      result = this.validate(parent, updatedFolder, [folder]);
    } else {
      result = { errors: [ROOT_FOLDER_CANNOT_BE_UPDATED] };
    }

    return {
      ...result,
      data: result.errors ? undefined : { updatedFolder: updatedFolder! },
    };
  }

  private static validate(
    parent: IFolder,
    folderData: Partial<IFolder>,
    siblingsToIgnore: AnyFolder[] = []
  ) {
    if (!folderData.name) {
      return { errors: [FOLDER_NAME_IS_REQUIRED] };
    }

    if (!this.isNameValid(folderData.name)) {
      return { errors: [FOLDER_NAME_IS_INVALID] };
    }

    if (this.nameIsAlreadyUsed(parent, folderData.name, siblingsToIgnore)) {
      return { errors: [FOLDER_NAME_ALREADY_USED] };
    }

    return {};
  }

  private static isNameValid(name: string) {
    return name.indexOf("/") === -1;
  };

  private static nameIsAlreadyUsed(
    parent: AnyFolder,
    name: string,
    siblingsToIgnore: AnyFolder[] = []
  ) {
    return parent.items.some((item) => {
      if (!ItemController.isFolder(item)) {
        return false;
      }

      const isIgnored = siblingsToIgnore.some((folder) => folder === item);
      return !isIgnored && item.name === name;
    });
  };
}
