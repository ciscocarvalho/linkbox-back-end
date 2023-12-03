import { ObjectId } from "mongodb";
import { DASHBOARD_NOT_FOUND } from "../constants/responseErrors";
import User, { IDashboard, IUser } from "../models/User";
import { DashboardSanitizer } from "../utils/sanitizers/DashboardSanitizer";
import { DashboardValidator } from "../utils/validators/DashboardValidator";
import { betterAssign } from "../utils/betterAssign";

class DashboardController {
  static getDefault() {
    return {
      name: "default",
      tree: { items: [], _id: new ObjectId().toString() },
    }
  }

  static async create(user: IUser, dashboard: Partial<IDashboard>) {
    const { dashboards } = user;
    dashboard = DashboardSanitizer.sanitizeCreation(dashboard);
    const validation = DashboardValidator.validateCreation(user, dashboard);

    if (validation.errors) {
      throw validation.errors;
    }

    dashboards.push(dashboard as IDashboard);
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

  static async update(dashboardName: string, user: IUser, dashboardData: Partial<IDashboard>) {
    const { dashboards } = user;
    const dashboard = this.getByName(dashboardName, user);
    const dashboardIndex = this.getIndex(user, dashboard);
    dashboardData = DashboardSanitizer.sanitizeUpdate(dashboard);
    const validation = DashboardValidator.validateUpdate(user, dashboard, dashboardData);

    if (validation.errors) {
      throw validation.errors;
    }

    dashboards[dashboardIndex] = betterAssign(dashboard, dashboardData);

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
