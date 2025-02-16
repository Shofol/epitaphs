import mongoose, { Schema, model } from "mongoose";

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
  verificationCodeExpires?: Date;
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
      default: false,
    },
    verificationCode: {
      type: Number,
      required: true,
    },
    verificationCodeExpires: {
      type: Date, // Ensure it is stored as a Date
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || model<UserDocument>("User", UserSchema);
export default User;
