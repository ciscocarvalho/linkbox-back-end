import { Request } from "express";
import { getUserOrThrowError } from "../../util/controller";
import DashboardController from "../../Controller/DashboardController";

export const getDataForItemRequest = async (req: Request) => {
  const userId = req.session!.userId!;
  const { dashboardName, id } = req.params;
  const user = await getUserOrThrowError(userId);
  const dashboard = await DashboardController.getByName(dashboardName, user);
  return { user, dashboard, id };
}
