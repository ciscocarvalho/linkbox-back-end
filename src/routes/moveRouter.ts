import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { getDataForItemRequest } from "./util/getDataFromRequest";
import ItemController from "../controllers/ItemController";

const moveRouter = Router();

moveRouter.use(isAuthenticated);

moveRouter.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const { parentId } = req.body;
    const item = await ItemController.move(user, dashboard, id, parentId);
    res.status(200).json({ data: { item } });
  } catch (error: any) {
    res.status(404).json({ error: { message: error.message } });
  }
});

export default moveRouter;
