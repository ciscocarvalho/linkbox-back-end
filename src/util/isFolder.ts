import { AnyFolder } from "../Model/User";

export const isFolder = (item: any): item is AnyFolder => {
  return "items" in item;
}
