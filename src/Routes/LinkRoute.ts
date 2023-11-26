import { Router } from "express";
import LinkController from "../Controller/LinkController";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { ILink } from "../Model/User";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const router = Router();

router.use(isAuthenticated);

router.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    const linkData: ILink = { ...req.body };
    const l = await LinkController.create(user, dashboard, linkData, parentId);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, id } = await getDataForItemRequest(req);
    const l = LinkController.getById(user, id);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.put("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const updatedLinkData = { ...req.body };
    const l = await LinkController.update(user, dashboard, id, updatedLinkData);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(200).json({ msg: error.message });
  }
});

router.delete("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const l = await LinkController.delete(user, dashboard, id);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
