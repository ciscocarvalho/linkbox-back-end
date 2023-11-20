import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { getUserOrThrowError } from "../util/controller";
import { getItemWithPath } from "./util/getItemWithPath";

const router = Router();

router.use(isAuthenticated);

router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.session!.userId!;
    const user = await getUserOrThrowError(userId);
    let itemWithPath = null;

    for (let { name, tree } of user.dashboards) {
      itemWithPath = getItemWithPath({ name, items: tree.items, _id: tree._id }, itemId);
      if (itemWithPath) {
        break;
      }
    }

    if (!itemWithPath) {
      throw new Error("Item not found");
    }

    res.status(200).json({ path: itemWithPath.path });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
