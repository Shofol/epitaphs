import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect unauthenticated users to login
  },
});

export const config = {
  matcher: ["/home/:path*"], // Protect dashboard and subroutes
};
