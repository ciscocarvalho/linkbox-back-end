import mongoose, { Schema, Document } from 'mongoose';
import Link, { ILink } from './Link';
import LinkSchema from "./Link"

export interface IFolder extends Document {
  name: String;
  descricao: String;
  color: String;
  link: ILink[];
}

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    link: [LinkSchema]
});

export default mongoose.model<IFolder>('Folder', FolderSchema);