import { Router } from "express";
import ItemController from "../controllers/ItemController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { IFolder, ILink } from "../models/User";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const itemsRouter = Router();

itemsRouter.use(isAuthenticated);

itemsRouter.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    const itemData: ILink | IFolder = { ...req.body };
    const item = await ItemController.create(user, dashboard, itemData, parentId);
    res.sendData({ item });
  } catch (error: any) {
    res.handleError(error);
  }
});

itemsRouter.get("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, id } = await getDataForItemRequest(req);
    const itemWithData = ItemController.getWithData(user, id) as any;
    delete itemWithData?.dashboard?.tree?.items;
    delete itemWithData?.parent?.items;
    res.sendData(itemWithData);
  } catch (error: any) {
    res.handleError(error);
  }
});

itemsRouter.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const updatedItemData = { ...req.body };
    const item = await ItemController.update(user, dashboard, id, updatedItemData);
    res.sendData({ item });
  } catch (error: any) {
    res.handleError(error);
  }
});

itemsRouter.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const item = await ItemController.delete(user, dashboard, id);
    res.sendData({ item });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default itemsRouter;
