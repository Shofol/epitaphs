"use server";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import bcrypt from "bcryptjs";

export const register = async (values: UserDocument) => {
  const { email, password } = values;

  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      verificationCode,
      verified: false,
      email,
      password: hashedPassword,
    });
    await user.save();
  } catch (e) {
    console.log(e);
  }
};
