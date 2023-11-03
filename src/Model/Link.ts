import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  name: String;
  descricao: String;
  color: String;
  image: String;
}

export const linkSchema = new Schema({
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
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Link = mongoose.model<ILink>("Link", linkSchema);

export default Link;
