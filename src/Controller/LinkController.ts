import { ObjectId } from "mongodb";
import { AnyFolder, IDashboard, IFolder, ILink, IUser } from "../Model/User";
import { getDashboardIndex, getItemParent } from "../util/controller";
import { isLink, removeItemInPlace } from "../util/util";
import { getItemWithPath } from "../Routes/util/getItemWithPath";

const getFolderOrThrowError = (user: IUser, id: string) => {
  const folder = getItemWithPath(user, id)?.item as IFolder | undefined;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return folder;
}

const getLinkOrThrowError = (user: IUser, id: string) => {
  const folder = getItemWithPath(user, id)?.item as ILink | undefined;

  if (!folder) {
    throw new Error("Link not found");
  }

  return folder;
}

const linkUrlIsAlreadyUsed = (parent: AnyFolder, url: string) => {
  return !!parent.items.find((item) => isLink(item) && item.url === url);
}

const isTitleValid = (title: string) => {
  return title.trim() !== "";
}

const isUrlValid = (url: string) => {
  return url.trim() !== "";
}

const add = async (user: IUser, dashboard: IDashboard, linkData: ILink, parentId: string) => {
    const dashboardIndex = getDashboardIndex(user, dashboard);
    const parentFolder = getFolderOrThrowError(user, parentId);

    if (!isUrlValid(linkData.url)) {
      throw new Error("Invalid link url");
    }

    if (!isTitleValid(linkData.title)) {
      throw new Error("Invalid link title");
    }

    if (linkUrlIsAlreadyUsed(parentFolder, linkData.url)) {
      throw new Error("Link url already used");
    }

    parentFolder.items.push(linkData);
    user.dashboards[dashboardIndex] = dashboard;
}

const remove = async (user: IUser, dashboard: IDashboard, id: string) => {
  const dashboardIndex = getDashboardIndex(user, dashboard);
  const link = getLinkOrThrowError(user, id);
  const parentFolder = getItemParent(user, link._id)!;

  if (!link) {
    throw new Error("Link not found");
  }

  removeItemInPlace(parentFolder.items, link);
  user.dashboards[dashboardIndex] = dashboard;

  return link;
}

class LinkController {
  static async create(user: IUser, dashboard: IDashboard, linkData: ILink, parentId: string) {
    linkData._id = new ObjectId().toString();
    add(user, dashboard, linkData, parentId);
    await user.save();
    return linkData;
  }

  static getById(user: IUser, id: string) {
    const itemWithPath = id ? getItemWithPath(user, id) : null;
    const link = itemWithPath?.item;

    if (!link || !isLink(link)) {
      throw new Error("Link not found");
    }

    return link;
  }

  static async update(user: IUser, dashboard: IDashboard, id: string, updatedLinkData: Partial<ILink>) {
    const dashboardIndex = getDashboardIndex(user, dashboard);
    const link = getLinkOrThrowError(user, id);
    const parentFolder = getItemParent(user, link._id);

    if (!parentFolder) {
      throw new Error("Folder not found");
    }

    const newUrl = updatedLinkData.url;

    if (newUrl && linkUrlIsAlreadyUsed(parentFolder, newUrl)) {
      throw new Error("Link url already used");
    }

    const parentItems = parentFolder.items;
    const linkIndex = parentItems.findIndex((item) => {
      return isLink(item) && item._id === link._id;
    });

    delete updatedLinkData._id;

    parentFolder.items[linkIndex] = Object.assign(link, updatedLinkData);
    user.dashboards[dashboardIndex] = dashboard;

    await user.save();
    return link;
  }

  static async delete(user: IUser, dashboard: IDashboard, id: string) {
    const link = await remove(user, dashboard, id);
    await user.save();
    return link;
  }

  static async move(user: IUser, dashboard: IDashboard, id: string, parentId: string) {
    const link = await remove(user, dashboard, id) as ILink;
    await add(user, dashboard, link, parentId);
    await user.save();
    return link;
  }
}

export default LinkController;
