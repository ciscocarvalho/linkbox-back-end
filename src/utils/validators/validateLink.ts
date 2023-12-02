import { INVALID_LINK_TITLE, INVALID_LINK_URL } from "../../constants/responseErrors";
import { ILink } from "../../models/User";

const isTitleValid = (title: string) => {
  return title.trim() !== "";
}

const isUrlValid = (url: string) => {
  return url.trim() !== "";
}

export const validateLink = (link: ILink) => {
  if (!isUrlValid(link.url)) {
    throw INVALID_LINK_URL;
  }

  if (!isTitleValid(link.title)) {
    throw INVALID_LINK_TITLE;
  }
}
