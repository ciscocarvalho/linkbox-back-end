import { AnyFolder } from "../../Model/User";
import { FOLDER_SEPARATOR } from "../../constants";
import { getLocationFromPath } from "../location/getLocationFromPath";
import { getParentFolderFromLocation } from "../location/getParentFolderFromLocation";

export const getParentFolderFromPath = (path: Path, root: AnyFolder, separator = FOLDER_SEPARATOR) => {
  return getParentFolderFromLocation(getLocationFromPath(path, separator), root);
}
