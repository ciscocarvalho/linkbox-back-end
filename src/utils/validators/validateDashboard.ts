import { DASHBOARD_NAME_ALREADY_TAKEN } from "../../constants/responseErrors";
import { IDashboard, IUser } from "../../models/User";

export const validateDashboard = (user: IUser, dashboard: IDashboard) => {
  const dashboardNameTaken = !!user.dashboards.find((thisDashboard) => thisDashboard.name === dashboard.name);

  if (dashboardNameTaken) {
    throw DASHBOARD_NAME_ALREADY_TAKEN;
  }
}
