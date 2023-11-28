import { IDashboard, IUser } from "../../Model/User";

export const validateDashboard = (user: IUser, dashboard: IDashboard) => {
  const dashboardNameTaken = !!user.dashboards.find((thisDashboard) => thisDashboard.name === dashboard.name);

  if (dashboardNameTaken) {
    throw new Error("Dashboard name already taken");
  }
}
