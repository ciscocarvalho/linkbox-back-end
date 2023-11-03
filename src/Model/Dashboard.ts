import mongoose, { Schema, Document } from "mongoose";
import { ILink, linkSchema } from "./Link";
import Folder, { IFolder, FolderSchema } from "./Folder";

export interface IDashboard extends Document {
  title: String;
  link: [ILink];
  folder: [IFolder];
}

export const dashboardSchema = new Schema<IDashboard>({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: [linkSchema],
    required: false,
  },
  folder: {
    type: [FolderSchema],
    required: false,
  },
});
const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
