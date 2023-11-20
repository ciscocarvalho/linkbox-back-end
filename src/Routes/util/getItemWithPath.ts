import { IFolder, IItem } from "../../Model/User";
import { isFolder } from "../../util/util";

type Location = string[];

const checkItemId = (item: IItem, id: string) => {
  return item._id.toString() === id;
};

const searchItemWithLocation = (root: IFolder, predicate: (item: IItem) => boolean) => {
  const location: Location = [root.name];

  if (predicate(root)) {
    return { item: root, location };
  }

  const search = ({ items }: IFolder) => {
    for (let item of items) {
      const item_label = isFolder(item) ? item.name : item.url;
      location.push(item_label);

      if (predicate(item)) {
        return item;
      }

      let found = isFolder(item) ? search(item) : false;

      if (found) {
        return item;
      }

      location.pop();
    }
  };

  const item = search(root);

  return item ? { item, location } : null;
};

const makePath = (location: Location) => {
  return location.join("/");
};

export const getItemWithPath = (root: IFolder, id: string) => {
  const itemWithLocation = searchItemWithLocation(root, (item: IItem) => checkItemId(item, id));

  if (!itemWithLocation) {
    return null;
  }

  return {
    item: itemWithLocation.item,
    path: makePath(itemWithLocation.location),
  }
};
