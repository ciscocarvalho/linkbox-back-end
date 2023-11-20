import { IFolder, IItem } from "../../Model/User";
import { isFolder } from "../../util/util";

type Location = string[];

const checkItemId = (item: IItem, id: string) => {
  return item._id.toString() === id;
};

const searchLocation = (root: IFolder, predicate: (item: IItem) => boolean) => {
  const location: Location = [root.name];

  if (predicate(root)) {
    return location;
  }

  const search = ({ items }: IFolder) => {
    for (let item of items) {
      const item_label = isFolder(item) ? item.name : item.url;
      location.push(item_label);

      if (predicate(item)) {
        return true;
      }

      let found = isFolder(item) ? search(item) : false;

      if (found) {
        return true;
      }

      location.pop();
    }

    return false;
  };

  const found = search(root);

  return found ? location : null;
};

const makePath = (location: Location) => {
  return location.join("/");
};

export const getItemPath = (root: IFolder, id: string) => {
  const location = searchLocation(root, (item: IItem) => checkItemId(item, id));

  if (!location) {
    return null;
  }

  return makePath(location);
};
