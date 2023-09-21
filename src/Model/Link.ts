import mongoose, { Schema, Document } from 'mongoose';

export interface ILink extends Document {
  name: String;
  descricao: String;
  color: String;
}

const LinkSchema = new Schema({
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
        required: true
    },
});

export default mongoose.model<ILink>('Link', LinkSchema);