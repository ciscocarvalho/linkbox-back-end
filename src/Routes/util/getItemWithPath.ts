import { IFolder, IItem, IUser } from "../../Model/User";
import { isFolder } from "../../util/util";

type Location = string[];

const checkItemId = (item: IItem, id: string) => {
  return item._id.toString() === id;
};

const getItemLabel = (item: IItem) =>  {
  if (isFolder(item)) {
    return item.name;
  }

  return encodeURIComponent(item.url);
}

const findItemAndLocation = (root: IFolder, predicate: (item: IItem) => boolean) => {
  const location: Location = [root.name];

  if (predicate(root)) {
    return { item: root, location };
  }

  const search = ({ items }: IFolder) => {
    for (let item of items) {
      const itemLabel = getItemLabel(item);
      location.push(itemLabel);

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

export const getItemWithPath = (user: IUser, id: string) => {
  for (let dashboard of user.dashboards) {
    let root = {
      name: "",
      items: dashboard.tree.items,
      _id: dashboard.tree._id,
    }

    const itemWithLocation = findItemAndLocation(root, (item: IItem) => checkItemId(item, id));

    if (!itemWithLocation) {
      continue;
    }

    const path = makePath(itemWithLocation.location).substring(1);
    return { item: itemWithLocation.item, path };
  }

  return null;
};
