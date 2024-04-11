import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function GET() {
  try {
    await connectToDatabase();
    const data = await prisma.roll.findMany({
      select: {
        id: true,
        order_number: true,
        name: true,
        color: true,
        combined: true,
        lining: true,
        size: true,
        workshop: true,
        total_quantity: true,
        order_date: true,
      },
      orderBy: {
        createdAt: "asc",
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
    const {
      order_number,
      name,
      color,
      combined,
      size,
      lining,
      workshop,
      total_quantity,
      order_date,
    } = await req.json();
    if (
      !order_number ||
      !name ||
      !color ||
      !combined ||
      !size ||
      !lining ||
      !workshop ||
      !total_quantity ||
      !order_date
    )
      return NextResponse.json(
        { message: "Provide all the data" },
        { status: 422 }
      );
    await connectToDatabase();
    const roll = await prisma.roll.create({
      data: {
        order_number,
        name,
        color,
        combined,
        size,
        lining,
        workshop,
        total_quantity,
        order_date,
      },
    });
    return NextResponse.json({ roll }, { status: 201 });
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
        { message: "Provide the ID properly" },
        { status: 422 }
      );
    await connectToDatabase();
    const roll = await prisma.roll.delete({
      where: { id },
    });
    return NextResponse.json({ roll }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
