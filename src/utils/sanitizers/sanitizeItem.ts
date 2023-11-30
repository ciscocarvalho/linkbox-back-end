import { ObjectId } from "mongodb";
import { IItem } from "../../models/User";
import ItemController from "../../controllers/ItemController";

export const sanitizeItem = (item: IItem) => {
  item._id = new ObjectId().toString();

  if (!ItemController.isFolder(item)) {
    return item;
  }

  if (!item.items) {
    item.items = [];
  }

  let items = [...item.items];

  while (items.length > 0) {
    const item = items.pop();

    if (item) {
      item._id = new ObjectId().toString();
    }

    if (ItemController.isFolder(item)) {
      if (!item.items) {
        item.items = [];
      }

      items = [...items, ...item.items];
    }
  }

  return item;
};
