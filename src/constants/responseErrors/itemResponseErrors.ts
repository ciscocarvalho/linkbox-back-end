import { ResponseError } from "../../utils/ResponseError";

export * from "./itemResponseErrors/folderResponseErrors";
export * from "./itemResponseErrors/linkResponseErrors";

const ERROR_TYPE = "ITEM_ERROR";

export const ITEM_NOT_FOUND = new ResponseError({
  name: "ITEM_NOT_FOUND",
  type: ERROR_TYPE,
  message: "This item was not found.",
});
