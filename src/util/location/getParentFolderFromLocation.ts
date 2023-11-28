import { AnyFolder } from "../../Model/User";
import { getFolderFromLocation } from "./getFolderFromLocation";

export const getParentFolderFromLocation = (location: Location, root: AnyFolder) => {
  const parentLocation = location.slice(0, location.length - 1);
  const parent = getFolderFromLocation(parentLocation, root);
  return parent;
}
