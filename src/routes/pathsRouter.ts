import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import ItemController from "../controllers/ItemController";

const pathsRouter = Router();

pathsRouter.use(isAuthenticated);

pathsRouter.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = req.session!.user!;
    const itemWithData = ItemController.getWithData(user, itemId);

    if (!itemWithData) {
      throw new Error("Item not found");
    }

    res.status(200).json({ data: { path: itemWithData.path } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default pathsRouter;
