import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function GET() {
  const data = await prisma.order.findMany({
    select: {
      id: true,
      title: true,
      gender: true,
      total_quantity: true,
      order_date: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const { title, gender, size, total_quantity, order_date } =
      await req.json();
    if (!title || !gender || !size || !total_quantity || !order_date)
      return NextResponse.json(
        { message: "Ingresa los datos correctamente" },
        { status: 422 }
      );
    await connectToDatabase();
    const order = await prisma.order.create({
      data: { title, gender, size, total_quantity, order_date },
    });
    return NextResponse.json({ order }, { status: 201 });
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
    const order = await prisma.order.delete({
      where: { id },
    });
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
