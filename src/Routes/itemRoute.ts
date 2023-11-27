import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { IFolder, ILink } from "../Model/User";
import { getDataForItemRequest } from "./util/getDataFromRequest";
import ItemController from "../Controller/ItemController";

const router = Router();

router.use(isAuthenticated);

router.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    const itemData: ILink | IFolder = { ...req.body };
    const createdItem = await ItemController.create(user, dashboard, itemData, parentId);
    res.status(200).json(createdItem);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, id } = await getDataForItemRequest(req);
    const item = ItemController.getById(user, id);
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const updatedItemData = { ...req.body };
    const updatedItem = await ItemController.update(user, dashboard, id, updatedItemData);
    res.status(200).json(updatedItem);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const deletedItem = await ItemController.delete(user, dashboard, id);
    res.status(200).json(deletedItem);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
