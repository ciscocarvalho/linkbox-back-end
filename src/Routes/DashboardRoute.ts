import DashboardController from "../Controller/DashboardController";
import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { IDashboard } from "../Model/User";

const router = Router();

router.use(isAuthenticated);

router.post("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const dashboard: IDashboard = { ...req.body };
    const dashboardSaved = await DashboardController.create(userId, dashboard);
    res.status(200).json(dashboardSaved);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const dashboards = await DashboardController.getAll(userId);
    res.status(200).json({ dashboards });
  } catch (error: any) {
    res.json({ msg: error.message });
  }
});

router.get("/:dashboardName", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const { dashboardName } = req.params;
    const dashboard = await DashboardController.getByName(dashboardName, userId);
    res.status(200).json(dashboard);
  } catch (error: any) {
    res.status(400).json({ msg: error });
  }
});

router.put("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const userId = req.session!.userId!;
    const updatedDashboardData = { ...req.body };
    const d = await DashboardController.update(dashboardName, userId, updatedDashboardData);
    res.status(200).json(d);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const userId = req.session!.userId!;
    const u = await DashboardController.delete(dashboardName, userId);
    res.status(200).json(u);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
