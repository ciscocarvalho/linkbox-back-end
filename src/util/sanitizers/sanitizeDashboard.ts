import { ObjectId } from "mongodb";
import { IDashboard } from "../../Model/User";

export const sanitizeDashboard = (dashboard: IDashboard) => {
  dashboard.tree = { items: [], _id: new ObjectId().toString() };
  return dashboard;
}
