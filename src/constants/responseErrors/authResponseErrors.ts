import { ResponseError } from "../../utils/ResponseError";

export * from "./authResponseErrors/signinResponseErrors";
export * from "./authResponseErrors/signupResponseErrors";
export * from "./authResponseErrors/changePasswordResponseErrors";

const ERROR_TYPE = "AUTH_ERROR";

export const USER_NOT_AUTHENTICATED = new ResponseError({
  type: ERROR_TYPE,
  message: "User is not authenticated.",
  userMessage: "Usuário não está autenticado.",
});

export const USER_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  message: "User was not found.",
  userMessage: "Usuário não foi encontrado.",
});

export const EMAIL_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  field: "email",
  message: "Email is required.",
  userMessage: "O email é obrigatório.",
});

export const PASSWORD_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  field: "password",
  message: "Password is required.",
  userMessage: "A senha é obrigatória.",
});
