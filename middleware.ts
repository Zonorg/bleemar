//Rutas protegidas
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/prendas/:path*",
    "/rollos/:path*",
    "/users/:path*",
    "/envios/:path*",
    "/settings/:path*",
    "/auth/register",
    "/api/auth/register",
    "/api/deliveries",
    "/api/payments",
    "/api/rollos",
    "/api/users",
  ],
};

// "/api/shipping" no está protegida acá porque woocommerce necesita hacer un webhook, está protegida dentro de la ruta
