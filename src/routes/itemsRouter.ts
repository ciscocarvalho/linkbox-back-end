import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { IFolder, ILink } from "../models/User";
import { getDataForItemRequest } from "./util/getDataFromRequest";
import ItemController from "../controllers/ItemController";

const itemsRouter = Router();

itemsRouter.use(isAuthenticated);

itemsRouter.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    const itemData: ILink | IFolder = { ...req.body };
    const item = await ItemController.create(user, dashboard, itemData, parentId);
    res.status(200).json({ data: { item } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

itemsRouter.get("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, id } = await getDataForItemRequest(req);
    const itemWithData = ItemController.getWithData(user, id) as any;
    delete itemWithData?.dashboard?.tree?.items;
    delete itemWithData?.parent?.items;
    res.status(200).json({ data: itemWithData });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

itemsRouter.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const updatedItemData = { ...req.body };
    const item = await ItemController.update(user, dashboard, id, updatedItemData);
    res.status(200).json({ data: { item } });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: { message: error.message } });
  }
});

itemsRouter.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const item = await ItemController.delete(user, dashboard, id);
    res.status(200).json({ data: { item } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default itemsRouter;
