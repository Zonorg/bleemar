// Extensión de la interfaz de sesión de NextAuth para usar roles u otros atributos
import { SessionBase, UserBase } from "next-auth";

declare module "next-auth" {
  interface Session extends SessionBase {
    role?: string;
  }

  interface User extends UserBase {
    role?: string;
  }
}

