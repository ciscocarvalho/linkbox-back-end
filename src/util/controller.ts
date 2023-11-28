import User, { AnyFolder, IDashboard, ILink, IUser, IItem, IFolder } from "../Model/User";
import { getFolderFromLocation } from "./location/getFolderFromLocation";
import { getLocationFromPath } from "./location/getLocationFromPath";
import { getParentLocation } from "./location/getParentLocation";
import { isLink } from "./isLink";
import { isFolder } from "./isFolder";
import { checkItemId } from "./checkItemId";

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

const getFolderOrThrowError = (dashboard: IDashboard, location?: Location) => {
  const root = dashboard.tree;
  const folder = location ? getFolderFromLocation(location, root) : root;

  if (!folder) {
    throw new Error("Folder not found");
  }

  return {
    folder: folder as AnyFolder
  };
}

const getLinkUrlFromLocation = (linkLocation: Location) => {
  let url = linkLocation[linkLocation.length - 1];

  if (!url) {
    return null;
  }

  return decodeURIComponent(url);
}

const getLinkOrThrowError = (dashboard: IDashboard, location: Location) => {
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

export const getDashboardIndex = (user: IUser, dashboard: IDashboard) => {
  return user.dashboards.findIndex((d) => d === dashboard);
}

export const getFolderByPath = (user: IUser, path: string) => {
  for (let dashboard of user.dashboards) {
    const location = getLocationFromPath(path);
    return getFolderOrThrowError(dashboard, location).folder;
  }
}

export const getLinkByPath = (user: IUser, path: string) => {
  for (let dashboard of user.dashboards) {
    const location = getLocationFromPath(path);
    return getLinkOrThrowError(dashboard, location).link;
  }
}

export const getItemByPath = async (user: IUser, path: string) => {
  const folder = getFolderByPath(user, path);

  if (folder) {
    return folder;
  }

  const link = getLinkByPath(user, path);

  if (link) {
    return link;
  }
}

const getItemLabel = (item: IItem) =>  {
  if (isFolder(item)) {
    return item.name;
  }

  return encodeURIComponent(item.url);
}

export const findItemAndLocation = (user: IUser, predicate: (item: IItem) => boolean) => {
  for (let dashboard of user.dashboards) {
    let root: IFolder = {
      name: dashboard.name,
      items: dashboard.tree.items,
      _id: dashboard.tree._id,
    }

    const location: Location = [root.name];

    if (predicate(root)) {
      return { item: root, location };
    }

    const search = ({ items }: IFolder): IItem | null => {
      for (let item of items) {
        const itemLabel = getItemLabel(item);
        location.push(itemLabel);

        if (predicate(item)) {
          return item;
        }

        let found = isFolder(item) ? search(item) : null;

        if (found) {
          return found;
        }

        location.pop();
      }

      return null;
    };

    const item = search(root);
    return item ? { item, location } : null;
  }

  return null;
};

export const getItemParent = (user: IUser, id: string) => {
  const parentWithLocation = findItemAndLocation(user, (parent) => {
    if (!isFolder(parent)) {
      return false;
    }

    return !!parent.items.find(child => checkItemId(child, id));
  });

  const parent = parentWithLocation?.item as IFolder | undefined;
  return parent ?? null;
}
