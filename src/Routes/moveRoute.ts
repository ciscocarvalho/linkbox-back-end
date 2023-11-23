import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import LinkController from "../Controller/LinkController";
import FolderController from "../Controller/FolderController";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const router = Router();

router.use(isAuthenticated);

router.post("/folder/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const { parentId } = req.body;
    const f = await FolderController.move(user, dashboard, id, parentId);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

router.post("/link/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id } = await getDataForItemRequest(req);
    const { parentId } = req.body;
    const l = await LinkController.move(user, dashboard, id, parentId);
    res.status(200).json(l);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

export default router;
