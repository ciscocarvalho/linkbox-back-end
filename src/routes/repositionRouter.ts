import { Router } from "express";
import ItemController from "../controllers/ItemController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const repositionRouter = Router();

repositionRouter.use(isAuthenticated);

repositionRouter.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    let {
      currentIndex,
      newIndex,
      strategy,
    }: {
      currentIndex: number;
      newIndex: number;
      strategy?: "before" | "after";
    } = req.body;
    const folder = await ItemController.reposition(user, dashboard, parentId, currentIndex, newIndex, strategy);
    res.sendData({ folder });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default repositionRouter;
