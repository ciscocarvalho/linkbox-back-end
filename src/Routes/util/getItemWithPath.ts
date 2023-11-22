import { IItem, IUser } from "../../Model/User";
import { findItemAndLocation } from "../../util/controller";

type Location = string[];

const checkItemId = (item: IItem, id: string) => {
  return item._id.toString() === id;
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
