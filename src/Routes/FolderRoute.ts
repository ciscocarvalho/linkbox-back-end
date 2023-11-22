import { Router } from "express";
import FolderController from "../Controller/FolderController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { IFolder } from "../Model/User";
import { FolderRequest, getFolderDataFromRequest } from "./util/folder";
import { getUserOrThrowError } from "../util/controller";

const router = Router();

router.use(isAuthenticated);

router.post(["/:dashboardName", "/:dashboardName/*"], async (req: FolderRequest, res) => {
  try {
    const { userId, dashboardName, path } = getFolderDataFromRequest(req);
    const clone: IFolder = { ...req.body };
    const user = await getUserOrThrowError(userId);
    const f = await FolderController.create(user, dashboardName, clone, path ?? "");
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get(["/:dashboardName", "/:dashboardName/*"], async (req: FolderRequest, res) => {
  try {
    const { userId, dashboardName, path } = getFolderDataFromRequest(req);
    const user = await getUserOrThrowError(userId);
    const f = await FolderController.getByPath(user, dashboardName, path ?? "");
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put(["/:dashboardName", "/:dashboardName/*"], async (req: FolderRequest, res) => {
  try {
    const { userId, dashboardName, path } = getFolderDataFromRequest(req);
    const updatedFolderData = { ...req.body };
    const user = await getUserOrThrowError(userId);
    const f = await FolderController.update(user, dashboardName, path ?? "", updatedFolderData);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete(["/:dashboardName", "/:dashboardName/*"], async (req: FolderRequest, res) => {
  try {
    const { userId, dashboardName, path } = getFolderDataFromRequest(req);
    const user = await getUserOrThrowError(userId);
    const f = await FolderController.delete(user, dashboardName, path ?? "");
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
