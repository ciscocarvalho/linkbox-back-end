import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "AUTH_ERROR";

export const EMAIL_NOT_FOUND = new ResponseError({
  name: "EMAIL_NOT_FOUND",
  type: ERROR_TYPE,
  field: "email",
  message: "Email not found.",
});

export const PASSWORD_IS_WRONG = new ResponseError({
  name: "PASSWORD_IS_WRONG",
  type: ERROR_TYPE,
  field: "password",
  message: "Password is wrong.",
});
