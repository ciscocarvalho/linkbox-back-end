import DashboardController from "../Controller/DashboardController";
import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { IDashboard } from "../Model/User";
import { getUserOrThrowError } from "../util/controller";

const router = Router();

router.use(isAuthenticated);

router.post("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const dashboard: IDashboard = { ...req.body };
    const user = await getUserOrThrowError(userId);
    const dashboardSaved = await DashboardController.create(user, dashboard);
    res.status(200).json({ data: { dashboard: dashboardSaved } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const user = await getUserOrThrowError(userId);
    const dashboards = await DashboardController.getAll(user);
    res.status(200).json({ data: { dashboards } });
  } catch (error: any) {
    res.json({ error: { message: error.message } });
  }
});

router.get("/:dashboardName", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const { dashboardName } = req.params;
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.getByName(dashboardName, user);
    res.status(200).json({ data: { dashboard } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.put("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const userId = req.session!.userId!;
    const updatedDashboardData = { ...req.body };
    const user = await getUserOrThrowError(userId);
    const dashboard = await DashboardController.update(dashboardName, user, updatedDashboardData);
    res.status(200).json({ data: { dashboard } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.delete("/:dashboardName", async (req, res) => {
  try {
    const { dashboardName } = req.params;
    const userId = req.session!.userId!;
    let user = await getUserOrThrowError(userId);
    user = await DashboardController.delete(dashboardName, user) as any;
    res.status(200).json({ data: { user } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default router;
