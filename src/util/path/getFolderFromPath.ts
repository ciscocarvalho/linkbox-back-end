import { AnyFolder } from "../../Model/User";
import { FOLDER_SEPARATOR } from "../../constants";
import { getFolderFromLocation } from "../location/getFolderFromLocation";
import { getLocationFromPath } from "../location/getLocationFromPath";

export const getFolderFromPath = (path: Path, root: AnyFolder, separator = FOLDER_SEPARATOR) => {
  const location = getLocationFromPath(path, separator)
  return getFolderFromLocation(location, root);
}
