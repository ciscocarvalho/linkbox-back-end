import { ObjectId } from "mongodb";
import { AnyFolder, ILink, IUser } from "../Model/User";
import { getDashboardOrThrowError, getFolderOrThrowError, getLinkOrThrowError, getLinkUrlFromLocation } from "../util/controller";
import { getLocationFromPath, getParentLocation, isLink, removeIndexFromArray } from "../util/util";

type Location = string[];
type Path = string;

const linkUrlIsAlreadyUsed = (parent: AnyFolder, url: string) => {
  return !!parent.items.find((item) => isLink(item) && item.url === url);
}

const getData = async (user: IUser, dashboardName: string, folderLocation: Location) => {
    const { dashboard, dashboardIndex } = getDashboardOrThrowError(user, dashboardName);
    const folder = getFolderOrThrowError(dashboard, folderLocation).folder;

    return { dashboard, dashboardIndex, folder };
}

const isTitleValid = (title: string) => {
  return title.trim() !== "";
}

const isUrlValid = (url: string) => {
  return url.trim() !== "";
}

const add = async (user: IUser, dashboardName: string, linkData: ILink, path: Path) => {
    if (!isUrlValid(linkData.url)) {
      throw new Error("Invalid link url");
    }

    if (!isTitleValid(linkData.title)) {
      throw new Error("Invalid link title");
    }

    const folderLocation = getLocationFromPath(path);

    const {
      dashboard,
      dashboardIndex,
      folder: destinationFolder,
    } = await getData(user, dashboardName, folderLocation);

    if (linkUrlIsAlreadyUsed(destinationFolder, linkData.url)) {
      throw new Error("Link url already used");
    }

    destinationFolder.items.push(linkData);
    user.dashboards[dashboardIndex] = dashboard;
}

const remove = async (user: IUser, dashboardName: string, path: Path) => {
  const linkLocation = getLocationFromPath(path);
  const linkUrl = getLinkUrlFromLocation(linkLocation);

  if (!linkUrl) {
    throw new Error("Link not found");
  }

  linkLocation[linkLocation.length - 1] = linkUrl;

  const parentLocation = getParentLocation(linkLocation);

  const {
    dashboard,
    dashboardIndex,
    folder: parentFolder,
  } = await getData(user, dashboardName, parentLocation);

  const { link, linkIndex } = getLinkOrThrowError(dashboard, linkLocation);

  parentFolder.items = removeIndexFromArray(parentFolder.items, linkIndex);
  user.dashboards[dashboardIndex] = dashboard;

  return link;
}

class LinkController {
  static async create(user: IUser, dashboardName: string, linkData: ILink, path: Path) {
    linkData._id = new ObjectId().toString();
    add(user, dashboardName, linkData, path);
    await user.save();
    return linkData;
  }

  static async getByPath(user: IUser, dashboardName: string, path: string) {
    const { dashboard } = getDashboardOrThrowError(user, dashboardName);
    const location = getLocationFromPath(path);
    const link = getLinkOrThrowError(dashboard, location);
    return link;
  }

  static async update(user: IUser, dashboardName: string, path: Path, updatedLinkData: Partial<ILink>) {
    const linkLocation = getLocationFromPath(path);
    const parentLocation = linkLocation.slice(0, linkLocation.length - 1);

    const {
      dashboard,
      dashboardIndex,
      folder: parentFolder,
    } = await getData(user, dashboardName, parentLocation);

    const { link, linkIndex } = getLinkOrThrowError(dashboard, linkLocation);

    const newUrl = updatedLinkData.url;

    if (newUrl && linkUrlIsAlreadyUsed(parentFolder, newUrl)) {
      throw new Error("Link url already used");
    }

    delete updatedLinkData._id;

    parentFolder.items[linkIndex] = Object.assign(link, updatedLinkData);
    user.dashboards[dashboardIndex] = dashboard;

    await user.save();
    return link;
  }

  static async delete(user: IUser, dashboardName: string, path: Path) {
    const link = await remove(user, dashboardName, path);
    await user.save();
    return link;
  }

  static async move(user: IUser, dashboardName: string, path: Path, targetPath: Path) {
    const link = await remove(user, dashboardName, path) as ILink;
    await add(user, dashboardName, link, targetPath);
  }
}

export default LinkController;
