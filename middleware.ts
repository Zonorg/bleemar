export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/cortes/:path*",
    "/prendas/:path*",
    "/settings/:path*",
    "/auth/register",
    "/api/:path*"
  ],
};
