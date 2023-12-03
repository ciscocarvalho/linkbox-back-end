import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "AUTH_ERROR";

export const USERNAME_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  field: "username",
  message: "Username is required.",
  userMessage: "O nome de usuário é obrigatório.",
});

export const EMAIL_IS_NOT_VALID = new ResponseError({
  type: ERROR_TYPE,
  field: "email",
  message: "This email is invalid.",
  userMessage: "Este email é inválido.",
});

export const EMAIL_ALREADY_USED = new ResponseError({
  type: ERROR_TYPE,
  field: "email",
  message: "This email is already used.",
  userMessage: "Este email já está em uso.",
});

export const PASSWORD_IS_TOO_WEAK = new ResponseError({
  type: ERROR_TYPE,
  field: "password",
  message: "This password is too weak. Password must have more than 6 characters.",
  userMessage: "Esta senha é fraca demais. Senha deve conter mais de 6 caracteres.",
});
