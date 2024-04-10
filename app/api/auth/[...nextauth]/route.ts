import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import bcrypt from "bcrypt";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        const userFound = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!userFound) throw new Error("Usuario no encontrado");
        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );
        if (!matchPassword) throw new Error("Contraseña incorrecta");
        return {
          id: userFound.id,
          username: userFound.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 1 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
