import { ILink } from "../Model/User";

export const isLink = (item: any): item is ILink => {
  return "url" in item;
}
