import { ResponseError } from "../../utils/ResponseError";

const ERROR_TYPE = "DASHBOARD_ERROR";

export const DASHBOARD_NAME_ALREADY_TAKEN = new ResponseError({
  type: ERROR_TYPE,
  message: "Dashboard name already taken",
  userMessage: "Nome de dashboard já está em uso",
});

export const DASHBOARD_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  message: "Dashboard not found",
  userMessage: "Dashboard não encontrada",
});
