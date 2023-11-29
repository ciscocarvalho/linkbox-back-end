import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import ItemController from "../Controller/ItemController";

const router = Router();

router.use(isAuthenticated);

router.get("/*", (req, res) => {
  try {
    let path = (req.params as any)[0] as string | undefined ?? "";
    path = path.split("/").slice(1).join("/");
    const user = req.session!.user!;
    const item = ItemController.getByPath(user, path);

    if (!item) {
      throw new Error("Item not found");
    }

    res.status(200).json({ data: { id: item._id } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default router;
