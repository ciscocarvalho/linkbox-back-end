import { DASHBOARD_NAME_IS_ALREADY_USED, DASHBOARD_NAME_IS_REQUIRED } from "../../constants/responseErrors";
import { IDashboard, IUser } from "../../models/User";

export class DashboardValidator {
  static validateCreation(user: IUser, dashboardData: Partial<IDashboard>) {
    if (!dashboardData.name) {
      return { errors: [DASHBOARD_NAME_IS_REQUIRED] };
    }

    const dashboardNameIsUsed = !!user.dashboards.find(({ name }) => name === dashboardData.name);

    if (dashboardNameIsUsed) {
      return { errors: [DASHBOARD_NAME_IS_ALREADY_USED] };
    }

    return {};
  }

  static validateUpdate(
    user: IUser,
    dashboard: IDashboard,
    dashboardData: Partial<IDashboard>
  ) {
    const dashboardNameIsUsed = !!user.dashboards.find((thisDashboard) => {
      thisDashboard !== dashboard && thisDashboard.name === dashboardData.name;
    });

    if (dashboardNameIsUsed) {
      return { errors: [DASHBOARD_NAME_IS_ALREADY_USED] };
    }

    return {};
  }
}
