import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  id: string;
  role: string;
  address?: string;
  phone?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
});

delete mongoose.models.User;
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
