import { Router } from "express";
import DashboardController from "../controllers/DashboardController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { IDashboard } from "../models/User";

const dashboardsRouter = Router();

dashboardsRouter.use(isAuthenticated);

dashboardsRouter.post("/", async (req, res) => {
  try {
    const dashboard: IDashboard = { ...req.body };
    const user = req.session!.user!;
    const dashboardSaved = await DashboardController.create(user, dashboard);
    res.sendData({ dashboard: dashboardSaved });
  } catch (error: any) {
    res.handleError(error);
  }
});

dashboardsRouter.get("/", async (req, res) => {
  try {
    const user = req.session!.user!;
    const dashboards = await DashboardController.getAll(user);
    res.sendData({ dashboards });
  } catch (error: any) {
    res.handleError(error);
  }
});

dashboardsRouter.get("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const user = req.session!.user!;
    const dashboard = DashboardController.getByName(dashboardName, user);
    res.sendData({ dashboard });
  } catch (error: any) {
    res.handleError(error);
  }
});

dashboardsRouter.put("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const updatedDashboardData = { ...req.body };
    const user = req.session!.user!;
    const dashboard = await DashboardController.update(dashboardName, user, updatedDashboardData);
    res.sendData({ dashboard });
  } catch (error: any) {
    res.handleError(error);
  }
});

dashboardsRouter.delete("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    let user = req.session!.user!;
    user = (await DashboardController.delete(dashboardName, user)) as any;
    res.sendData({ user });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default dashboardsRouter;
