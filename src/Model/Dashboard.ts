
import { Schema, Document } from 'mongoose';

// Esquema para o documento Dashboard
export interface IDashboard extends Document {
  title: string;
  widgets: string[];
}

const dashboardSchema = new Schema<IDashboard>({
  title: {
    type: String,
    required: true
  },
  widgets: [String],
});

export default dashboardSchema;