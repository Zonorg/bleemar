import { connectToDatabase } from "@/prisma/server-helpers";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json(
        { message: "Ingresa los datos correctamente" },
        { status: 422 }
      );

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
    console.log(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};