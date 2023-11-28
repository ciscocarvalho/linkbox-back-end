import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { getItemWithPath } from "./util/getItemWithPath";

const router = Router();

router.use(isAuthenticated);

router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = req.session!.user!;
    const itemWithPath = getItemWithPath(user, itemId);

    if (!itemWithPath) {
      throw new Error("Item not found");
    }

    res.status(200).json({ data: { path: itemWithPath.path } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default router;
