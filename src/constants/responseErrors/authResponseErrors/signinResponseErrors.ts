import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "AUTH_ERROR";

export const EMAIL_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  field: "email",
  message: "Email not found.",
  userMessage: "Este email não foi encontrado.",
});

export const PASSWORD_IS_WRONG = new ResponseError({
  type: ERROR_TYPE,
  field: "password",
  message: "Password is wrong.",
  userMessage: "Esta senha está incorreta.",
});
