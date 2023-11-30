import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import ItemController from "../controllers/ItemController";

const idsRouter = Router();

idsRouter.use(isAuthenticated);

idsRouter.get("/*", (req, res) => {
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

export default idsRouter;
