import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import FolderController from "../Controller/FolderController";
import { getDataForItemRequest } from "./util/getDataFromRequest";

const router = Router();

router.use(isAuthenticated);

router.post("/:dashboardName/:id", async (req, res) => {
  try {
    const { user, dashboard, id: parentId } = await getDataForItemRequest(req);
    let {
      currentIndex,
      newIndex,
      strategy,
    }: {
      currentIndex: number,
      newIndex: number,
      strategy?: "before" | "after",
    } = req.body;
    const f = await FolderController.reposition(user, dashboard, parentId, currentIndex, newIndex, strategy);
    res.status(200).json(f);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

export default router;
