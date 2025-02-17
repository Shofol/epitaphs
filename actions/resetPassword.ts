"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const reset = async (email: string, password: string) => {
  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user in the database
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { passwordResetLinkExpires: 1 },
      },
      { new: true }, // Return the updated user
    ).lean();

    return { data: JSON.parse(JSON.stringify(user)) };
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
};
