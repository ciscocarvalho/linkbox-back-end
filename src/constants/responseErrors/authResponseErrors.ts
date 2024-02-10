import { ResponseError } from "../../utils/ResponseError";

export * from "./authResponseErrors/signinResponseErrors";
export * from "./authResponseErrors/signupResponseErrors";
export * from "./authResponseErrors/changePasswordResponseErrors";

const ERROR_TYPE = "AUTH_ERROR";

export const USER_NOT_AUTHENTICATED = new ResponseError({
  name: "USER_NOT_AUTHENTICATED",
  type: ERROR_TYPE,
  message: "User is not authenticated.",
});

export const USER_NOT_FOUND = new ResponseError({
  name: "USER_NOT_FOUND",
  type: ERROR_TYPE,
  message: "User was not found.",
});

export const EMAIL_IS_REQUIRED = new ResponseError({
  name: "EMAIL_IS_REQUIRED",
  type: ERROR_TYPE,
  field: "email",
  message: "Email is required.",
});

export const PASSWORD_IS_REQUIRED = new ResponseError({
  name: "PASSWORD_IS_REQUIRED",
  type: ERROR_TYPE,
  field: "password",
  message: "Password is required.",
});
