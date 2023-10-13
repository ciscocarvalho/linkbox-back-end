import express, { response } from "express";
import DashboardController from "../Controller/DashboardController";
import { IDashboard } from "../Model/Dashboard";
import { Request, Response } from "express";

const router = express.Router();

router.post("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const clone: IDashboard = { ...req.body };
    const dashboardSaved = await DashboardController.post(userId, clone);
    console.log('030')
    res.status(200).json(dashboardSaved);
  } catch (error) {
    res.status(400).json({ msg: "erro ao salvar a dashboard" });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const dashboards = await DashboardController.getAll(userId);
    res.status(200).json(dashboards);
  } catch (error) {
    res.json({ msg: "erro ao encontrar as dashboards" });
  }
});

router.get("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const dashboardId = req.params.dashboardId;
    const userId = req.params.userId;
    const dashboard = await DashboardController.getById(dashboardId, userId);
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.put("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const dashboardId = req.params.dashboardId;
    const userId = req.params.userId;
    const updatedDashboardData = req.body;
    const d = await DashboardController.put(
      dashboardId,
      userId,
      updatedDashboardData
    );
    res.status(200).json(d);
  } catch (error) {
    res.status(400).json({ msg: "erro ao atualizar" });
  }
});

router.delete("/:userId/:dashboardId", async (req: Request, res: Response) => {
  try {
    const dashboardId = req.params.dashboardId;
    const userId = req.params.userId;
    const a = await DashboardController.delete(userId, dashboardId);

    res.status(200).json(a);
  } catch (error) {
    res.status(400).json({ msg: "erro ao deletar o usuário" });
  }
});

export default router;
