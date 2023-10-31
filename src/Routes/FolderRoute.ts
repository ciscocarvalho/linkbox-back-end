import express from "express";
import { Request, Response } from "express";

import FolderController from "../Controller/FolderController";
import { IFolder } from "../Model/Folder";

const router = express.Router();


router.post("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const path = req.params[0]
    const dashboardId = req.params.dashboardId;
    const clone: IFolder = { ...req.body };
    const f = await FolderController.post(userId, dashboardId, clone,path);
    res.status(200).json(f);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});


router.post("/:userId/:dashboardId/*", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const path = req.params[0]
    const dashboardId = req.params.dashboardId;
    const clone: IFolder = { ...req.body };
    const f = await FolderController.post(userId, dashboardId, clone,path);
    res.status(200).json(f);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const f = await FolderController.getAll(userId, dashboardId);
    res.status(200).json(f);
  } catch (error) {
    res.status(400).json(error);
  }
});



router.put("/:userId/:dashboardId/:*",
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const path = req.params[0];
      const updatedFolderData = req.body;
      const f = await FolderController.put(
        userId,
        dashboardId,
        path,
        updatedFolderData
      );
      res.status(200).json(f);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.delete("/:userId/:dashboardId/*",
  async (req: Request, res: Response) => {
      try {
        const userId = req.params.userId
        const dashboardId = req.params.dashboardId
        const path = req.params[0];
        const f = await FolderController.delete(userId, dashboardId, path)
        res.status(200).json(f)
      } catch (error) {
        res.status(400).json(error)
      }
  }
);

export default router;
