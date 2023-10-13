import express from "express";
import { Request, Response } from "express";

import FolderController from "../Controller/FolderController";
import { IFolder } from "../Model/Folder";

const router = express.Router();

router.post("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboardId = req.params.dashboardId;
    const clone: IFolder = { ...req.body };
    const f = await FolderController.post(userId, dashboardId, clone);
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

router.put("/:userId/:dashboardId/:folderId",
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const dashboardId = req.params.dashboardId;
      const folderId = req.params.folderId;
      const updatedFolderData = req.body;
      const f = await FolderController.put(
        userId,
        dashboardId,
        folderId,
        updatedFolderData
      );
      res.status(200).json(f);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.delete("/:userId/:dashboardId/:folderId",
  async (req: Request, res: Response) => {
      try {
        const userId = req.params.userId
        const dashboardId = req.params.dashboardId
        const folderId = req.params.folderId;
        const f = await FolderController.delete(userId, dashboardId, folderId)
        res.status(200).json(f)
      } catch (error) {
        res.status(400).json(error)
      }
  }
);

export default router;
