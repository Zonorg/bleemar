import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function GET() {
  try {
    const data = await prisma.cut.findMany({
      select: {
        id: true,
        color: true,
        size: true,
        total_quantity: true,
        cut_date: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const { color, size, total_quantity, cut_date } = await req.json();
    if (!color || !size || !total_quantity || !cut_date)
      return NextResponse.json(
        { message: "Ingresa los datos correctamente" },
        { status: 422 }
      );
    await connectToDatabase();
    const cut = await prisma.cut.create({
      data: { color, size, total_quantity, cut_date },
    });
    return NextResponse.json({ cut }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json(
        { message: "Ingresa el id correctamente" },
        { status: 422 }
      );
    await connectToDatabase();
    const cut = await prisma.cut.delete({
      where: { id },
    });
    return NextResponse.json({ cut }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
