import { Router } from "express";
import FolderController from "../Controller/FolderController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { IFolder, IUser } from "../Model/User";
import { getItemWithPath } from "./util/getItemWithPath";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const router = Router();

router.use(isAuthenticated);

const getFolderPath = (user: IUser, id?: string) => {
  if (!id) {
    return "";
  }

  const itemWithPath = getItemWithPath(user, id);

  if (!itemWithPath) {
    throw new Error("Folder not found");
  }

  return itemWithPath.path;
}

router.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    const clone: IFolder = { ...req.body };
    const f = await FolderController.create(user, dashboard, clone, parentId);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get(["/:dashboardName", "/:dashboardName/:id"], async (req, res) => {
  try {
    const { user, id } = await getDataForItemRequest(req);
    const path = getFolderPath(user, id);
    const f = FolderController.getByPath(user, path);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const updatedFolderData = { ...req.body };
    const f = await FolderController.update(user, dashboard, id, updatedFolderData);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const f = await FolderController.delete(user, dashboard, id);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
