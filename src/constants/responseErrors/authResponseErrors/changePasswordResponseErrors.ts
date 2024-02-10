import { ResponseError } from "../../../utils/ResponseError";
import { PASSWORD_IS_TOO_WEAK } from "../../responseErrors";

const ERROR_TYPE = "AUTH_ERROR";

export const CURRENT_PASSWORD_IS_REQUIRED = new ResponseError({
  name: "CURRENT_PASSWORD_IS_REQUIRED",
  type: ERROR_TYPE,
  field: "currentPassword",
  message: "Password is required.",
});

export const CURRENT_PASSWORD_IS_WRONG = new ResponseError({
  name: "CURRENT_PASSWORD_IS_WRONG",
  type: ERROR_TYPE,
  field: "currentPassword",
  message: "Current password is wrong.",
});

export const NEW_PASSWORD_IS_REQUIRED = new ResponseError({
  name: "NEW_PASSWORD_IS_REQUIRED",
  type: ERROR_TYPE,
  field: "newPassword",
  message: "New password is required.",
});

export const NEW_PASSWORD_IS_TOO_WEAK = new ResponseError({
  ...PASSWORD_IS_TOO_WEAK,
  field: "newPassword",
});
