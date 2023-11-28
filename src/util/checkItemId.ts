import { IItem } from "../Model/User";

export const checkItemId = (item: IItem, id: string) => {
  return item._id.toString() === id;
};
