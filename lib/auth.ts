import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new Error("Wrong Email");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!passwordMatch) throw new Error("Wrong Password");
        if (!user.verified)
          throw new Error("Email is not verified yet. Please verify to login");
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Store the user data inside token (only on first login)
      if (user) {
        token.verified = user.verified; // Add verified flag to token
        token.id = user.id; // Optional: Store user ID
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the verified flag to the session
      session.user.verified = token.verified;
      session.user.id = token.id; // Optional: Store user ID in session
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60,
  },
};
