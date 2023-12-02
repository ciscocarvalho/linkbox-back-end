import { ResponseError } from "../../utils/ResponseError";

const ERROR_TYPE = "ITEM_ERROR";

export const ITEM_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  message: "Item not found",
  userMessage: "Item não encontrado",
});

export const INVALID_LINK_URL = new ResponseError({
  type: ERROR_TYPE,
  message: "Invalid link url",
  userMessage: "URL inválida de link",
});

export const INVALID_LINK_TITLE = new ResponseError({
  type: ERROR_TYPE,
  message: "Invalid link title",
  userMessage: "Título inválido de link",
});

export const FOLDER_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  message: "Folder not found",
  userMessage: "Pasta não encontrada",
});

export const INVALID_FOLDER_NAME = new ResponseError({
  type: ERROR_TYPE,
  message: "Invalid folder name",
  userMessage: "Nome inválido de pasta",
});

export const FOLDER_NAME_ALREADY_USED = new ResponseError({
  type: ERROR_TYPE,
  message: "Folder name already used",
  userMessage: "Nome de pasta já está em uso",
});

export const CANNOT_UPDATE_ROOT_FOLDER = new ResponseError({
  type: ERROR_TYPE,
  message: "Cannot update root folder",
  userMessage: "Não é possível editar pasta raíz",
});
