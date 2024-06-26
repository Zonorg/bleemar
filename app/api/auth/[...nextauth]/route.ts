import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import bcrypt from "bcrypt";
import { User } from "next-auth";

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
          name: userFound.name,
          username: userFound.username,
          role: userFound.role,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name;
        token.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.role === "string") {
        session.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
