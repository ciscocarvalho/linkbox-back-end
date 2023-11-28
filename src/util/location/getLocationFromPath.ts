import { FOLDER_SEPARATOR } from "../../constants";

export const getLocationFromPath = (path: Path, separator = FOLDER_SEPARATOR): Location => {
  return path === "" ? [] : path.split(separator);
}
