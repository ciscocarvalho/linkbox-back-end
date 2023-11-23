import { IItem, IUser } from "../../Model/User";
import { findItemAndLocation } from "../../util/controller";
import { checkItemId } from "../../util/util";

type Location = string[];

const makePath = (location: Location) => {
  return location.join("/");
};

export const getItemWithPath = (user: IUser, id: string) => {
  const itemWithLocation = findItemAndLocation(user, (item: IItem) => checkItemId(item, id));

  if (!itemWithLocation) {
    return null;
  }

  itemWithLocation.location = itemWithLocation.location.slice(1);
  const path = makePath(itemWithLocation.location);
  return { item: itemWithLocation.item, path };
};
