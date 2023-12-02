import { ResponseError } from "../../utils/ResponseError";

const ERROR_TYPE = "AUTH_ERROR";

export const NO_CURRENT_USER_AUTHENTICATED = new ResponseError({
  type: ERROR_TYPE,
  message: "No current user authenticated",
  userMessage: "Não há usuário autenticado",
});

export const INVALID_PASSWORD = new ResponseError({
  type: ERROR_TYPE,
  message: "Invalid password",
  userMessage: "Senha inválida",
});

export const USER_NOT_FOUND = new ResponseError({
  type: ERROR_TYPE,
  message: "User not found",
  userMessage: "Usuário não encontrado",
});
