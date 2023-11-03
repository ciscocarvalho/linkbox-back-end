import { Schema, Document, model } from "mongoose";
import { ILink, linkSchema } from "./Link";

export interface IFolder extends Document {
  name: String;
  descricao: String;
  color: String;
  link: [ILink];
  folder: [IFolder];
}

export const FolderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  link: [linkSchema],
});

FolderSchema.add({
  folder: [FolderSchema],
});

const Folder = model<IFolder>("Folder", FolderSchema);

export default Folder;
