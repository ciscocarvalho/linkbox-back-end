import { ObjectId } from "mongodb";
import { IDashboard } from "../../models/User";

export const sanitizeDashboard = (dashboard: IDashboard) => {
  dashboard.tree = { items: [], _id: new ObjectId().toString() };
  return dashboard;
}
