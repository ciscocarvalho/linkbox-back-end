import { ResponseError } from "../utils/ResponseError";

export * from "./responseErrors/authResponseErrors";
export * from "./responseErrors/itemResponseErrors";
export * from "./responseErrors/dashboardResponseErrors";

export const UNKNOWN_ERROR = new ResponseError({
  type: "UNKNOWN_ERROR",
  message: "Something went wrong :(",
  userMessage: "Algo deu errado :(",
});
