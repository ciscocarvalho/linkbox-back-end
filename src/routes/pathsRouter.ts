import { Router } from "express";
import ItemController from "../controllers/ItemController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { ITEM_NOT_FOUND } from "../constants/responseErrors";

const pathsRouter = Router();

pathsRouter.use(isAuthenticated);

pathsRouter.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = req.session!.user!;
    const itemWithData = ItemController.getWithData(user, itemId);

    if (itemWithData) {
      res.sendData({ path: itemWithData.path });
    } else {
      throw ITEM_NOT_FOUND;
    }
  } catch (error: any) {
    res.handleError(error);
  }
});

export default pathsRouter;
