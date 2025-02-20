"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const inactivate = async (email: string) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    console.log(user);

    if (!user) {
      return {
        error: "Invalid email",
      };
    }

    // Update user in the database
    await User.findOneAndUpdate(
      { email }, // Find user by email
      {
        $set: { active: false },
      },
      { new: true }, // Return the updated user
    );
  } catch (error) {
    return { error };
  }
};
