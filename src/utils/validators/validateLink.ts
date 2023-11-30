import ItemController from "../../controllers/ItemController";
import { AnyFolder, IFolder, ILink } from "../../models/User";

const isTitleValid = (title: string) => {
  return title.trim() !== "";
}

const isUrlValid = (url: string) => {
  return url.trim() !== "";
}

const linkUrlIsAlreadyUsed = (parent: AnyFolder, url: string) => {
  return !!parent.items.find((item) => ItemController.isLink(item) && item.url === url);
}

export const validateLink = (parent: IFolder, link: ILink) => {
  if (!isUrlValid(link.url)) {
    throw new Error("Invalid link url");
  }

  if (!isTitleValid(link.title)) {
    throw new Error("Invalid link title");
  }

  if (linkUrlIsAlreadyUsed(parent, link.url)) {
    throw new Error("Link url already used");
  }
}
