import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import ItemController from "../controllers/ItemController";
import DashboardController from "../controllers/DashboardController";
import { FOLDER_SEPARATOR } from "../constants";

const folderIdsRouter = Router();

folderIdsRouter.use(isAuthenticated);

folderIdsRouter.get("/:dashboardName/*", (req, res) => {
  try {
    let path = ((req.params as any)[0] as string | undefined) ?? "";
    const user = req.session!.user!;
    const { dashboardName } = req.params;

    if (path.startsWith(dashboardName)) {
      path = path.substring(dashboardName.length + FOLDER_SEPARATOR.length);
    }

    const dashboard = DashboardController.getByName(dashboardName, user);
    const folderWithData = ItemController.getFolderByPath(dashboard, path);

    if (!folderWithData) {
      throw new Error("Folder not found");
    }

    res.status(200).json({ data: folderWithData });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default folderIdsRouter;
