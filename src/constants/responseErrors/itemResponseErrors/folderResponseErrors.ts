import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "ITEM_ERROR";
const ITEM_TYPE = "folder";

export const FOLDER_NOT_FOUND = new ResponseError({
  name: "FOLDER_NOT_FOUND",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  message: "This folder was not found.",
});

export const FOLDER_NAME_IS_REQUIRED = new ResponseError({
  name: "FOLDER_NAME_IS_REQUIRED",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "name",
  message: "Folder name is required.",
});

export const FOLDER_NAME_IS_INVALID = new ResponseError({
  name: "FOLDER_NAME_IS_INVALID",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "name",
  message: "This folder name is invalid.",
});

export const FOLDER_NAME_ALREADY_USED = new ResponseError({
  name: "FOLDER_NAME_ALREADY_USED",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "name",
  message: "This folder name is already used.",
});

export const ROOT_FOLDER_CANNOT_BE_UPDATED = new ResponseError({
  name: "ROOT_FOLDER_CANNOT_BE_UPDATED",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  message: "Cannot update root folder.",
});
