import { Router } from "express";
import { FOLDER_SEPARATOR } from "../constants";
import DashboardController from "../controllers/DashboardController";
import ItemController from "../controllers/ItemController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { FOLDER_NOT_FOUND } from "../constants/responseErrors";

const foldersFromPathsRouter = Router();

foldersFromPathsRouter.use(isAuthenticated);

foldersFromPathsRouter.get("/:dashboardName/*", (req, res) => {
  try {
    let path = ((req.params as any)[0] as string | undefined) ?? "";
    const user = req.session!.user!;
    const { dashboardName } = req.params;

    if (path.startsWith(dashboardName)) {
      path = path.substring(dashboardName.length + FOLDER_SEPARATOR.length);
    }

    const dashboard = DashboardController.getByName(dashboardName, user);
    const folderWithData = ItemController.getFolderByPath(dashboard, path);

    if (folderWithData) {
      res.sendData(folderWithData);
    } else {
      throw FOLDER_NOT_FOUND;
    }
  } catch (error: any) {
    res.handleError(error);
  }
});

export default foldersFromPathsRouter;
