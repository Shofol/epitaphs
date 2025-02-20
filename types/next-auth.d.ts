import { DefaultSession, DefaultUser } from "next-auth";

// Extend the User type
declare module "next-auth" {
  interface User extends DefaultUser {
    verified: boolean; // ✅ Add the verified property
    maxAge?: number;
  }

  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      image?: string;
      verified?: boolean; // ✅ Add verified to session user
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    verified?: boolean; // ✅ Add verified to JWT
    maxAge?: number;
  }
}
