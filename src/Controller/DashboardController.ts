import User, { IDashboard, IUser } from "../Model/User";
import { getDashboardOrThrowError } from "../util/controller";
import { sanitizeDashboard } from "../util/sanitizers/sanitizeDashboard";
import { validateDashboard } from "../util/validators/validateDashboard";

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

  static async getByName(dashboardName: string, user: IUser) {
    const { dashboard } = getDashboardOrThrowError(user, dashboardName);

    return dashboard;
  }

  static async update(dashboardName: string, user: IUser, updatedDashboardData: Partial<IDashboard>) {
    const { dashboards } = user;
    const dashboardIndex = user.dashboards.findIndex((d) => d.name === dashboardName);
    const dashboard = dashboards[dashboardIndex];

    if (!dashboard) {
      throw new Error("Dashboard not found");
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
