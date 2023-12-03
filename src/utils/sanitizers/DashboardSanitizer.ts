import { ObjectId } from "mongodb";
import { IDashboard } from "../../models/User";
import { CommonSanitizer } from "./CommonSanitizer";

export class DashboardSanitizer {
  static sanitizeCreation(dashboardData: Partial<IDashboard>) {
    dashboardData = { ...dashboardData };
    dashboardData.name = CommonSanitizer.sanitizeString(dashboardData.name);
    dashboardData.tree = { items: [], _id: new ObjectId().toString() };

    return {
      name: dashboardData.name,
      tree: dashboardData.tree,
    };
  }

  static sanitizeUpdate(dashboardData: Partial<IDashboard>) {
    dashboardData = { ...dashboardData };
    dashboardData.name = CommonSanitizer.sanitizeString(dashboardData.name);
    return { name: dashboardData.name };
  }
}
