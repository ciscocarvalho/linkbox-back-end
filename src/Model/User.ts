import { Schema, Document, model } from "mongoose";
import { IDashboard, dashboardSchema } from "./Dashboard";

export interface IUser extends Document {
  email: String;
  password: String;
  dashboards: IDashboard[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dashboards: {
    type: [dashboardSchema],
    required: false,
  },
});

const User = model<IUser>("User", userSchema);

export default User;
