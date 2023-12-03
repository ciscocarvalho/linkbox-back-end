import { ResponseError } from "../../utils/ResponseError";

const ERROR_TYPE = "DASHBOARD_ERROR";

export const DASHBOARD_NAME_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  message: "Dashboard name is required.",
  userMessage: "O nome de dashboard é obrigatório.",
});

export const DASHBOARD_NAME_IS_ALREADY_USED = new ResponseError({
  type: ERROR_TYPE,
  message: "Dashboard name is already used.",
  userMessage: "Este nome de dashboard já está em uso.",
});

export const DASHBOARD_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  message: "Dashboard not found.",
  userMessage: "Esta dashboard não foi encontrada.",
});
