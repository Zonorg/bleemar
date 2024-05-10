export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/prendas/:path*",
    "/rollos/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/auth/register",
    "/api/auth/register",
    "/api/deliveries",
    "/api/payments",
    "/api/rollos",
    "/api/users",
  ],
};
