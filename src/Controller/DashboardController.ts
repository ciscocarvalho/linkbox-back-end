import { ObjectId } from "mongodb";
import User, { IDashboard } from "../Model/User";
import { getDashboardOrThrowError, getUserOrThrowError } from "../util/controller";

class DashboardController {
  static async create(userId: string, dashboard: IDashboard) {
    const user = await getUserOrThrowError(userId);
    const { dashboards } = user;
    const dashboardNameTaken = !!dashboards.find((thisDashboard) => thisDashboard.name === dashboard.name);

    if (dashboardNameTaken) {
      throw new Error("Dashboard name already taken");
    }

    dashboard.tree = { items: [], _id: new ObjectId().toString() };

    dashboards.push(dashboard);

    await user.save();
    return user;
  }

  static async getAll(userId: string) {
    const user = await getUserOrThrowError(userId);
    const dashboards = user.dashboards;

    return dashboards;
  }

  static async getByName(dashboardName: string, userId: string) {
    const user = await getUserOrThrowError(userId);
    const { dashboard } = getDashboardOrThrowError(user, dashboardName);

    return dashboard;
  }

  static async update(dashboardName: string, userId: string, updatedDashboardData: Partial<IDashboard>) {
    const user = await getUserOrThrowError(userId);
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

  static async delete(dashboardName: string, userId: string) {
    await getUserOrThrowError(userId);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { dashboards: { name: dashboardName } },
      },
      { new: true },
    );

    return updatedUser;
  }
}

export default DashboardController;
