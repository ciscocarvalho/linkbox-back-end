import { ObjectId } from "mongodb";
import { IFolder } from "../../models/User";
import ItemController from "../../controllers/ItemController";
import { CommonSanitizer } from "./CommonSanitizer";

export class FolderSanitizer {
  static sanitizeCreation(folderCandidate: Partial<IFolder>) {
    return this.sanitize(folderCandidate, true);
  }

  static sanitizeUpdate(folderData: Partial<IFolder>) {
    return this.sanitize(folderData, false);
  }

  private static sanitize(folderData: Partial<IFolder>, replaceIds: boolean) {
    folderData = { ...folderData };
    folderData.name = CommonSanitizer.sanitizeString(folderData.name);
    folderData.description = CommonSanitizer.sanitizeString(folderData.description);
    folderData.color = CommonSanitizer.sanitizeString(folderData.color);
    folderData = this.filterFields(folderData);

    if (replaceIds) {
      folderData._id = new ObjectId().toString();
    }

    if (!folderData.items) {
      folderData.items = [];
    }

    let items = [...folderData.items];

    while (items.length > 0) {
      const item = items.pop();

      if (item && replaceIds) {
        item._id = new ObjectId().toString();
      }

      if (ItemController.isFolder(item)) {
        if (!item.items) {
          item.items = [];
        }

        items = [...items, ...item.items];
      }
    }

    return folderData;
  }

  private static filterFields<T extends Partial<IFolder>>(folderData: T): T {
    return {
      name: folderData.name,
      items: folderData.items,
      description: folderData.description,
      color: folderData.color,
      _id: folderData._id,
    } as T;
  }
}
