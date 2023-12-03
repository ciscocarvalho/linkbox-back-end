import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "ITEM_ERROR";
const ITEM_TYPE = "folder";

export const FOLDER_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  message: "This folder was not found.",
  userMessage: "Esta pasta não foi encontrada.",
});

export const FOLDER_NAME_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "name",
  message: "Folder name is required.",
  userMessage: `O nome de pasta é obrigatório.`,
});

export const FOLDER_NAME_IS_INVALID = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "name",
  message: "This folder name is invalid.",
  userMessage: `Este nome de pasta é inválido. Nome de pasta não pode conter "/".`,
});

export const FOLDER_NAME_ALREADY_USED = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "name",
  message: "This folder name is already used.",
  userMessage: "Este nome de pasta já está em uso.",
});

export const ROOT_FOLDER_CANNOT_BE_UPDATED = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  message: "Cannot update root folder.",
  userMessage: "Não é possível editar pasta raíz.",
});
