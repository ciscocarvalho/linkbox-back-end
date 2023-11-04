import { IDashboard } from "../Model/Dashboard";
import User from "../Model/User";

class DashboardController {
  static async post(userId: string, dashboard: IDashboard) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("erro usuário não encontrado");
    }

    user.dashboards.push(dashboard);
    await user.save();

    return user;
  }

  static async getAll(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("usuário não encontrado");
    }

    const dashboards = user.dashboards;

    return dashboards;
  }

  static async getById(dashboardId: string, userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    if (!dashboard) {
      throw new Error("Dashboard não encontrada.");
    }

    return dashboard;
  }

  static async put(dashboardId: string, userId: string, updatedDashboardData: Partial<IDashboard>) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const dashboard = user.dashboards.find((d) => d.title.toString() === dashboardId);

    Object.assign(dashboard, updatedDashboardData);

    await user.save();

    return dashboard;
  }

  static async delete(userId: string, dashboardId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { dashboards: { _id: dashboardId } },
      },
      { new: true },
    );

    return updatedUser;
  }
}

export default DashboardController;
