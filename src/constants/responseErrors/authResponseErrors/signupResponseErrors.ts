import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "AUTH_ERROR";

export const USERNAME_IS_REQUIRED = new ResponseError({
  name: "USERNAME_IS_REQUIRED",
  type: ERROR_TYPE,
  field: "username",
  message: "Username is required.",
});

export const EMAIL_IS_NOT_VALID = new ResponseError({
  name: "EMAIL_IS_NOT_VALID",
  type: ERROR_TYPE,
  field: "email",
  message: "This email is invalid.",
});

export const EMAIL_ALREADY_USED = new ResponseError({
  name: "EMAIL_ALREADY_USED",
  type: ERROR_TYPE,
  field: "email",
  message: "This email is already used.",
});

export const PASSWORD_IS_TOO_WEAK = new ResponseError({
  name: "PASSWORD_IS_TOO_WEAK",
  type: ERROR_TYPE,
  field: "password",
  message: "This password is too weak. Password must have more than 6 characters.",
});
