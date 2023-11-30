import { ILink } from "../../models/User";

const isTitleValid = (title: string) => {
  return title.trim() !== "";
}

const isUrlValid = (url: string) => {
  return url.trim() !== "";
}

export const validateLink = (link: ILink) => {
  if (!isUrlValid(link.url)) {
    throw new Error("Invalid link url");
  }

  if (!isTitleValid(link.title)) {
    throw new Error("Invalid link title");
  }
}
