import { IDashboard, IFolder, IItem } from "../../Model/User";
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

const searchItemWithLocation = (root: IFolder, predicate: (item: IItem) => boolean) => {
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

export const getItemWithPath = (rootOrDashboard: IFolder | IDashboard, id: string) => {
  let root;

  if ("tree" in rootOrDashboard) {
    root = {
      name: "",
      items: rootOrDashboard.tree.items,
      _id: rootOrDashboard.tree._id,
    }
  } else {
    root = rootOrDashboard;
  }

  const itemWithLocation = searchItemWithLocation(root, (item: IItem) => checkItemId(item, id));

  if (!itemWithLocation) {
    return null;
  }

  let path = makePath(itemWithLocation.location);

  if (path.charAt(0) === "/") {
    path = path.substring(1);
  }

  return { item: itemWithLocation.item, path };
};
