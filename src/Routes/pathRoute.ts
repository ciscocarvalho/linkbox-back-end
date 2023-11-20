import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { getUserOrThrowError } from "../util/controller";
import { IFolder, IItem, } from "../Model/User";
import { isFolder } from "../util/util";

type Location = string[];

const router = Router();

router.use(isAuthenticated);

const checkItemId = (item: IItem, id: string) => {
  return item._id.toString() === id;
}

const searchLocation = (root: IFolder, predicate: (item: IItem) => boolean) => {
  const location: Location = [root.name];

  if (predicate(root)) {
    return location;
  }

  const search = ({ items }: IFolder) => {
    for (let item of items) {
      const item_label = isFolder(item) ? item.name : item.url;
      location.push(item_label);

      if (predicate(item)) {
        return true;
      }

      let found = isFolder(item) ? search(item) : false;

      if (found) {
        return true;
      }

      location.pop();
    }

    return false;
  };

  const found = search(root);

  return found ? location : null;
};

const searchLocationById = (root: IFolder, id: string) => {
  return searchLocation(root, (item: IItem) => checkItemId(item, id));
};

const makePath = (location: Location) => {
  return location.join("/");
}

router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.session!.userId!;
    const user = await getUserOrThrowError(userId);
    let location = null;

    for (let { name, tree } of user.dashboards) {
      location = searchLocationById({ name, items: tree.items, _id: tree._id }, itemId);
      if (location) {
        break;
      }
    }

    if (!location) {
      throw new Error("Item not found");
    }

    res.status(200).json({ path: makePath(location) });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
