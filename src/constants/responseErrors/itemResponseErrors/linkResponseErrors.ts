import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "ITEM_ERROR";
const ITEM_TYPE = "link";

export const LINK_URL_IS_REQUIRED = new ResponseError({
  name: "LINK_URL_IS_REQUIRED",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "url",
  message: "URL is required.",
});

export const LINK_TITLE_IS_REQUIRED = new ResponseError({
  name: "LINK_TITLE_IS_REQUIRED",
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "title",
  message: "Title is required.",
});
