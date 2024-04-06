export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/cortes/:path*", "/prendas/:path*", "/auth/register"],
};
