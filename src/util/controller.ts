import User, { AnyFolder, IDashboard, ILink, IUser } from "../Model/User";
import { getFolderFromLocation, getParentLocation, isLink } from "./util";

type Location = string[];

export const getUserOrThrowError = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export const getDashboardOrThrowError = (user: IUser, dashboardName: string) => {
  const dashboardIndex = user.dashboards.findIndex((d) => d.name === dashboardName);
  const dashboard = user.dashboards[dashboardIndex];

  if (!dashboard) {
    throw new Error("Dashboard not found");
  }

  return { dashboard, dashboardIndex };
}

export const getFolderOrThrowError = (dashboard: IDashboard, location?: Location) => {
  const root = dashboard.tree;
  const folder = location ? getFolderFromLocation(location, root) : root;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return {
    folder: folder as AnyFolder
  };
}

export const getLinkUrlFromLocation = (linkLocation: Location) => {
  let url = linkLocation[linkLocation.length - 1];

  if (!url) {
    return null;
  }

  return decodeURIComponent(url);
}

export const getLinkOrThrowError = (dashboard: IDashboard, location: Location) => {
  const parentLocation = getParentLocation(location);
  const parentFolder = getFolderOrThrowError(dashboard, parentLocation).folder;
  const url = getLinkUrlFromLocation(location);

  if (url === null) {
    throw new Error("Link not found");
  }

  const { items } = parentFolder;

  const linkIndex = items.findIndex((item) => {
    return isLink(item) && item.url === url;
  });

  const link = items[linkIndex] as ILink | undefined;

  if (!link) {
    throw new Error("Link not found");
  }

  return { link, linkIndex };
}
