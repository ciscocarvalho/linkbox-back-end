import { Request, Router } from "express";
import FolderController from "../Controller/FolderController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { IFolder } from "../Model/User";
import { getUserOrThrowError } from "../util/controller";
import DashboardController from "../Controller/DashboardController";
import { getItemWithPath } from "./util/getItemWithPath";

const router = Router();

router.use(isAuthenticated);

const getFolderDataFromRequest = async (req: Request) => {
  const userId = req.session!.userId!;
  const { dashboardName, id } = req.params;
  const user = await getUserOrThrowError(userId);
  const dashboard = await DashboardController.getByName(dashboardName, user)
  let path;

  if (id) {
    const itemWithPath = getItemWithPath(dashboard, id);

    if (!itemWithPath) {
      throw new Error("Folder not found");
    }

    path = itemWithPath.path;
  } else {
    path = "";
  }

  return { user, dashboard, path };
}

router.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, path } = await getFolderDataFromRequest(req);
    const clone: IFolder = { ...req.body };
    const f = await FolderController.create(user, dashboard, clone, path ?? "");
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get(["/:dashboardName", "/:dashboardName/:id"], async (req, res) => {
  try {
    const { dashboard, path } = await getFolderDataFromRequest(req);
    const f = await FolderController.getByPath(dashboard, path ?? "");
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, path } = await getFolderDataFromRequest(req);
    const updatedFolderData = { ...req.body };
    const f = await FolderController.update(user, dashboard, path ?? "", updatedFolderData);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, path } = await getFolderDataFromRequest(req);
    const f = await FolderController.delete(user, dashboard, path ?? "");
    res.status(200).json(f);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
