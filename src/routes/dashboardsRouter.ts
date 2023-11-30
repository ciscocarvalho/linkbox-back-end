import DashboardController from "../controllers/DashboardController";
import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import { IDashboard } from "../models/User";

const dashboardsRouter = Router();

dashboardsRouter.use(isAuthenticated);

dashboardsRouter.post("/", async (req, res) => {
  try {
    const dashboard: IDashboard = { ...req.body };
    const user = req.session!.user!;
    const dashboardSaved = await DashboardController.create(user, dashboard);
    res.status(200).json({ data: { dashboard: dashboardSaved } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

dashboardsRouter.get("/", async (req, res) => {
  try {
    const user = req.session!.user!;
    const dashboards = await DashboardController.getAll(user);
    res.status(200).json({ data: { dashboards } });
  } catch (error: any) {
    res.json({ error: { message: error.message } });
  }
});

dashboardsRouter.get("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const user = req.session!.user!;
    const dashboard = await DashboardController.getByName(dashboardName, user);
    res.status(200).json({ data: { dashboard } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

dashboardsRouter.put("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const updatedDashboardData = { ...req.body };
    const user = req.session!.user!;
    const dashboard = await DashboardController.update(dashboardName, user, updatedDashboardData);
    res.status(200).json({ data: { dashboard } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

dashboardsRouter.delete("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    let user = req.session!.user!;
    user = await DashboardController.delete(dashboardName, user) as any;
    res.status(200).json({ data: { user } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default dashboardsRouter;
