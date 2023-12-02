import { Router } from "express";
import ItemController from "../controllers/ItemController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const moveRouter = Router();

moveRouter.use(isAuthenticated);

moveRouter.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const { parentId } = req.body;
    const item = await ItemController.move(user, dashboard, id, parentId);
    res.sendData({ item });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default moveRouter;
