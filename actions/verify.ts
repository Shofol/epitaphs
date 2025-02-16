"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const verify = async ({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: string;
}) => {
  try {
    await connectDB();

    // Find the user with the email & verification code
    const user = await User.findOne({ email, verificationCode });
    console.log(user);

    if (!user || user.verificationCodeExpires < new Date()) {
      return {
        error: "Invalid or expired code",
      };
    }

    // Update user in the database
    await User.findOneAndUpdate(
      { email }, // Find user by email
      {
        $set: { verified: true }, // Set verified to true
        $unset: { verificationCode: 1, verificationCodeExpires: 1 }, // Remove verification fields
      },
      { new: true }, // Return the updated user
    );
  } catch (error) {
    return { error };
  }
};
