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
        rememberMe: { label: "RememberMe", type: "boolean" },
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
        if (!user.active) {
          throw new Error("Locked");
        }

        const maxAge =
          credentials?.rememberMe === "true" ? 60 * 60 * 24 * 30 : 60 * 30;
        user.maxAge = maxAge;
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
        token.maxAge = Math.floor(Date.now() / 1000) + user.maxAge!;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the verified flag to the session
      session.user.verified = token.verified as boolean;
      session.user.id = token.id as string; // Optional: Store user ID in session
      session.expires = new Date((token.maxAge as number) * 1000).toISOString();
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
