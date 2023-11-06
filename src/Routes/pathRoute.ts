import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { getUserOrThrowError } from "../util/controller";
import { AnyFolder, ILink } from "../Model/User";
import { isFolder, isLink } from "../util/util";

type Location = (string | null)[];

const router = Router();

router.use(isAuthenticated);

const getFolderName = (folder: AnyFolder) => {
  return "name" in folder ? folder.name : null;
}

const itemsToLocation = (items: (AnyFolder | ILink)[]) => {
  return items.map((item) => {
    if (isLink(item)) {
      return encodeURIComponent(item.url);
    }

    return getFolderName(item);
  })
}

const searchLocationById = (folder: AnyFolder, id: string): Location => {
  let folders = [folder];
  let found = false;
  let locationItems: (AnyFolder | ILink)[] = [];

  if (folder._id.toString() === id) {
    found = true;
    locationItems = [folder];
  }

  while (folders.length > 0 && !found) {
    folder = folders.shift()!;
    locationItems.push(folder);

    for (let folderItem of folder.items) {
      if (folderItem._id.toString() === id) {
        found = true;
        locationItems.push(folderItem);
        break;
      }

      if (isFolder(folderItem)) {
        folders.push(folderItem);
      }
    }
  }

  if (!found) {
    locationItems = [];
  }

  const location = itemsToLocation(locationItems);

  return location;
}

const makePath = (dashboardName: string, location: Location) => {
  location = location.filter(name => name !== null);
  return [dashboardName, ...location].join("/");
}

router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.session!.userId!;
    const user = await getUserOrThrowError(userId);
    let dashboardName: string;
    let location: ReturnType<typeof searchLocationById> = [];

    user.dashboards.forEach(({ name, tree }) => {
      location = searchLocationById(tree, itemId);
      if (location.length > 0) {
        dashboardName = name;
        return;
      }
    });

    if (location.length === 0) {
      throw new Error("Item not found");
    }

    const path = makePath(dashboardName!, location);

    res.status(200).json({ path });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
