import { Request, Router } from "express";
import LinkController from "../Controller/LinkController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { ILink } from "../Model/User";
import { getUserOrThrowError } from "../util/controller";
import DashboardController from "../Controller/DashboardController";
import { getItemWithPath } from "./util/getItemWithPath";

const router = Router();

router.use(isAuthenticated);

const getLinkDataFromRequest = async (req: Request) => {
  const userId = req.session!.userId!;
  const user = await getUserOrThrowError(userId);
  const { dashboardName, id } = req.params;
  const dashboard = await DashboardController.getByName(dashboardName, user);
  const itemWithPath = getItemWithPath(dashboard, id);

  if (!itemWithPath) {
    throw new Error("Link not found");
  }

  return { user, dashboard, path: itemWithPath.path };
}

router.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, path } = await getLinkDataFromRequest(req);
    const linkData: ILink = { ...req.body };
    const l = await LinkController.create(user, dashboard, linkData, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get("/:dashboardName/:id", async (req, res) => {
  try {
    const { dashboard, path } = await getLinkDataFromRequest(req);
    const l = LinkController.getByPath(dashboard, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, path } = await getLinkDataFromRequest(req);
    const updatedLinkData = { ...req.body };
    const l = await LinkController.update(user, dashboard, path, updatedLinkData);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(200).json({ msg: error.message });
  }
});

router.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, path } = await getLinkDataFromRequest(req);
    const l = await LinkController.delete(user, dashboard, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
