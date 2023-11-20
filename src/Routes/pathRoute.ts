import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { getUserOrThrowError } from "../util/controller";
import { getItemPath } from "./util/getItemPath";

const router = Router();

router.use(isAuthenticated);

router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.session!.userId!;
    const user = await getUserOrThrowError(userId);
    let itemPath = null;

    for (let { name, tree } of user.dashboards) {
      itemPath = getItemPath({ name, items: tree.items, _id: tree._id }, itemId);
      if (itemPath) {
        break;
      }
    }

    if (!itemPath) {
      throw new Error("Item not found");
    }

    res.status(200).json({ path: itemPath });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
