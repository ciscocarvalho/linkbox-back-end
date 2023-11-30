import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { getDataForItemRequest } from "./util/getDataFromRequest";
import ItemController from "../controllers/ItemController";

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
      currentIndex: number,
      newIndex: number,
      strategy?: "before" | "after",
    } = req.body;
    const folder = await ItemController.reposition(user, dashboard, parentId, currentIndex, newIndex, strategy);
    res.status(200).json({ data: { folder } });
  } catch (error: any) {
    res.status(404).json({ error: { message: error.message } });
  }
});

export default repositionRouter;
