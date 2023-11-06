import { Router } from "express";
import LinkController from "../Controller/LinkController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { ILink } from "../Model/User";
import { LinkRequest, getLinkDataFromRequest } from "./util/link";

const router = Router();

router.use(isAuthenticated);

router.post(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const linkData: ILink = { ...req.body };
    const l = await LinkController.create(userId, dashboardName, linkData, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const l = await LinkController.getByPath(userId, dashboardName, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const updatedLinkData = { ...req.body };
    const l = await LinkController.update(userId, dashboardName, path, updatedLinkData);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(200).json({ msg: error.message });
  }
});

router.delete(["/:dashboardName", "/:dashboardName/*"], async (req: LinkRequest, res) => {
  try {
    const { userId, dashboardName, path } = getLinkDataFromRequest(req);
    const l = await LinkController.delete(userId, dashboardName, path);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
