import { ResponseError } from "../utils/ResponseError";

export * from "./responseErrors/authResponseErrors";
export * from "./responseErrors/itemResponseErrors";
export * from "./responseErrors/dashboardResponseErrors";

export const UNKNOWN_ERROR = new ResponseError({
  name: "UNKNOWN_ERROR",
  type: "UNKNOWN_ERROR",
  message: "Something went wrong :(",
});
