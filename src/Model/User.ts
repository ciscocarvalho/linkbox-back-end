import { Document } from "mongodb";
import { Schema, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  dashboards: IDashboard[];
}

export interface ILink {
  title: string;
  url: string;
  description?: string;
  color?: string;
  image?: string;
  _id: string;
}

export interface IFolder {
  name: string;
  items: Array<IFolder | ILink>;
  description?: string;
  color?: string;
  _id: string;
}

export interface IRootFolder {
  items: IFolder["items"];
  _id: string;
}

export type AnyFolder = IRootFolder | IFolder;

export interface IDashboard {
  name: string,
  tree: IRootFolder,
}

export const LinkSchema = {
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
};

const folderSchema = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  items: [{
    type: Schema.Types.Mixed,
    default: (): any[] => [],
    required: false,
  }],
}

const dashboardSchema = {
  name: {
    type: String,
    required: true,
  },
  tree: {
    type: {
      items: {
        type: folderSchema.items,
        required: true
      }
    },
    required: true,
  },
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
    default: () => [],
    required: false,
  },
});

const User = model<IUser>("User", userSchema);

export default User;
