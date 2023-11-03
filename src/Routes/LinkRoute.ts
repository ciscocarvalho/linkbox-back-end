import { Request, Response, Router } from "express";
import LinkController from "../Controller/LinkController";
import { ILink } from "../Model/Link";

const router = Router();

router.post("/:userId/:dashboardId/*", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const path = req.params[0];
    const linkData: ILink = { ...req.body };
    const l = await LinkController.post(userId, dashboardId, linkData, path);
    res.status(200).json(l);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.post("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    console.log("09090");
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const path = req.params[0];
    const linkData: ILink = { ...req.body };
    const l = await LinkController.post(userId, dashboardId, linkData, path);
    res.status(200).json(l);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const l = await LinkController.getAllInDashboard(userId, dashboardId);
    res.status(200).json(l);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/:userId/:dashboardId/*", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const path = req.params[0];
    const updatedLinkData = req.body;
    const l = await LinkController.put(userId, dashboardId, path, updatedLinkData);
    res.status(200).json(l);
  } catch (error) {
    res.status(200).json(error);
  }
});

router.delete("/:userId/:dashboardId/*", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const path = req.params[0];
    const l = LinkController.delete(userId, dashboardId, path);
    res.status(200).json(l);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
