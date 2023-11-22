import { Router } from "express";
import LinkController from "../Controller/LinkController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { ILink } from "../Model/User";
import { LinkRequest, getLinkDataFromRequest } from "./util/link";
import { getUserOrThrowError } from "../util/controller";
import DashboardController from "../Controller/DashboardController";

const router = Router();

router.use(isAuthenticated);

router.post(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const linkData: ILink = { ...req.body };
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.getByName(dashboardName, user);
    const l = await LinkController.create(user, dashboard, linkData, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.getByName(dashboardName, user);
    const l = await LinkController.getByPath(dashboard, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const updatedLinkData = { ...req.body };
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.getByName(dashboardName, user);
    const l = await LinkController.update(user, dashboard, path, updatedLinkData);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(200).json({ msg: error.message });
  }
});

router.delete(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.getByName(dashboardName, user);
    const l = await LinkController.delete(user, dashboard, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
