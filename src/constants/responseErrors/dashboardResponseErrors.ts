import { ResponseError } from "../../utils/ResponseError";

const ERROR_TYPE = "DASHBOARD_ERROR";

export const DASHBOARD_NAME_IS_REQUIRED = new ResponseError({
  name: "DASHBOARD_NAME_IS_REQUIRED",
  type: ERROR_TYPE,
  message: "Dashboard name is required.",
});

export const DASHBOARD_NAME_IS_ALREADY_USED = new ResponseError({
  name: "DASHBOARD_NAME_IS_ALREADY_USED",
  type: ERROR_TYPE,
  message: "Dashboard name is already used.",
});

export const DASHBOARD_NOT_FOUND = new ResponseError({
  name: "DASHBOARD_NOT_FOUND",
  type: ERROR_TYPE,
  message: "Dashboard not found.",
});
