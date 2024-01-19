import { ResponseError } from "../../../utils/ResponseError";
import { PASSWORD_IS_TOO_WEAK } from "../../responseErrors";

const ERROR_TYPE = "AUTH_ERROR";

export const CURRENT_PASSWORD_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  field: "currentPassword",
  message: "Password is required.",
  userMessage: "A senha é obrigatória.",
});

export const CURRENT_PASSWORD_IS_WRONG = new ResponseError({
  type: ERROR_TYPE,
  field: "currentPassword",
  message: "Current password is wrong.",
  userMessage: "Senha atual está incorreta.",
});

export const NEW_PASSWORD_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  field: "newPassword",
  message: "New password is required.",
  userMessage: "Nova senha é obrigatória.",
});

export const NEW_PASSWORD_IS_TOO_WEAK = new ResponseError({
  ...PASSWORD_IS_TOO_WEAK,
  field: "newPassword",
});
