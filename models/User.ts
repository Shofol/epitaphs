import { Schema, model } from "mongoose";

export interface UserDocument {
  _id?: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  image?: string;
  verified?: string;
  createdAt?: Date;
  updatedAt?: Date;
  verificationCode?: number;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      minlength: 12,
      match: [
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/,
        "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ],
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    verificationCode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<UserDocument>("User", UserSchema);
export default User;
