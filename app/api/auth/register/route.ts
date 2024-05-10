import { connectToDatabase } from "@/prisma/server-helpers";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

async function getSession(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return null; // Devolver null si no hay sesión de usuario
  }
  return session;
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { message: "Ingresa los datos correctamente" },
        { status: 422 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "El nombre de usuario ya está en uso" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connectToDatabase();
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
