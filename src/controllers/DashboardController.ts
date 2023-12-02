import { DASHBOARD_NOT_FOUND } from "../constants/responseErrors";
import User, { IDashboard, IUser } from "../models/User";
import { sanitizeDashboard } from "../utils/sanitizers/sanitizeDashboard";
import { validateDashboard } from "../utils/validators/validateDashboard";

class DashboardController {
  static async create(user: IUser, dashboard: IDashboard) {
    const { dashboards } = user;
    dashboard = sanitizeDashboard(dashboard);
    validateDashboard(user, dashboard);
    dashboards.push(dashboard);
    await user.save();
    return user;
  }

  static async getAll(user: IUser) {
    const dashboards = user.dashboards;

    return dashboards;
  }

  static getIndex(user: IUser, dashboard: IDashboard) {
    return user.dashboards.findIndex((thisDashboard) => thisDashboard === dashboard);
  }

  static getByName(dashboardName: string, user: IUser) {
    const dashboard = user.dashboards.find((d) => d.name === dashboardName);

    if (!dashboard) {
      throw DASHBOARD_NOT_FOUND;
    }

    return dashboard;
  }

  static async update(dashboardName: string, user: IUser, updatedDashboardData: Partial<IDashboard>) {
    const { dashboards } = user;
    const dashboardIndex = user.dashboards.findIndex((d) => d.name === dashboardName);
    const dashboard = dashboards[dashboardIndex];

    if (!dashboard) {
      throw DASHBOARD_NOT_FOUND;
    }

    dashboards[dashboardIndex] = Object.assign(dashboard, updatedDashboardData);

    await user.save();
    return dashboard;
  }

  static async delete(dashboardName: string, user: IUser) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $pull: { dashboards: { name: dashboardName } },
      },
      { new: true },
    );

    return updatedUser;
  }
}

export default DashboardController;
