// UserModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import dashboardSchema, {IDashboard} from './Dashboard';


// Defina o esquema para o modelo User
interface IUser extends Document {
  email: string;
  password: string;
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
  dashboards: [dashboardSchema], 
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;