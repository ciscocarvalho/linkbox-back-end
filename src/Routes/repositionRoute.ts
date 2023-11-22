import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import FolderController from "../Controller/FolderController";
import { FolderRequest, getFolderDataFromRequest } from "./util/folder";
import { getUserOrThrowError } from "../util/controller";
import DashboardController from "../Controller/DashboardController";

const router = Router();

router.use(isAuthenticated);

router.post(["/:dashboardName", "/:dashboardName/*"], async (req: FolderRequest, res) => {
  try {
    const { userId, dashboardName, path } = getFolderDataFromRequest(req);
    let {
      currentIndex,
      newIndex,
      strategy,
    }: {
      currentIndex: number,
      newIndex: number,
      strategy?: "before" | "after",
    } = req.body;
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.getByName(dashboardName, user);
    const f = await FolderController.reposition(user, dashboard, path ?? "", currentIndex, newIndex, strategy);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

export default router;
