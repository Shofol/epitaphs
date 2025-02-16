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
      verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
      verified: false,
      email,
      password: hashedPassword,
    });
    await user.save();
    await fetch(`${process.env.URL}/api/send`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verificationCode: verificationCode,
      }),
    });
  } catch (e) {
    console.log(e);
  }
};
