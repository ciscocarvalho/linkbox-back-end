import { Request } from "express";
import DashboardController from "../../controllers/DashboardController";

export const getDataForItemRequest = async (req: Request) => {
  const { dashboardName, id } = req.params;
  const user = req.session!.user!;
  const dashboard = await DashboardController.getByName(dashboardName, user);
  return { user, dashboard, id };
}
