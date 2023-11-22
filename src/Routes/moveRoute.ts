import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import LinkController from "../Controller/LinkController";
import FolderController from "../Controller/FolderController";
import { LinkRequest, getLinkDataFromRequest } from "./util/link";
import { FolderRequest, getFolderDataFromRequest } from "./util/folder";
import { getUserOrThrowError } from "../util/controller";

const router = Router();

router.use(isAuthenticated);

router.post("/folder/:dashboardName/*", async (req: FolderRequest, res) => {
  try {
    const { userId, dashboardName, path } = getFolderDataFromRequest(req);
    let { targetPath } = req.body;
    targetPath = targetPath.split("/").slice(1).join("/");
    const user = await getUserOrThrowError(userId);
    const f = await FolderController.move(user, dashboardName, path!, targetPath);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

router.post("/link/:dashboardName/*", async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    let { targetPath } = req.body;
    targetPath = targetPath.split("/").slice(1).join("/");
    const user = await getUserOrThrowError(userId);
    const l = await LinkController.move(user, dashboardName, path, targetPath);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

export default router;
