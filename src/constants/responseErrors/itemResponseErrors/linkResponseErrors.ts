import { ResponseError } from "../../../utils/ResponseError";

const ERROR_TYPE = "ITEM_ERROR";
const ITEM_TYPE = "link";

export const LINK_URL_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "url",
  message: "URL is required.",
  userMessage: "A URL é obrigatória.",
});

export const LINK_TITLE_IS_REQUIRED = new ResponseError({
  type: ERROR_TYPE,
  itemType: ITEM_TYPE,
  field: "title",
  message: "Title is required.",
  userMessage: "O título é obrigatório.",
});
