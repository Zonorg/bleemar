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
        size: true,
        workshop: true,
        total_quantity: true,
        order_date: true,
        rollcuts: true,
        rolldetails: true,
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

async function getNextOrderNumber() {
  try {
    await connectToDatabase();
    const lastRoll = await prisma.roll.findFirst({
      orderBy: { order_number: "desc" },
    });
    const lastOrderNumber = lastRoll ? lastRoll.order_number : 0;
    return lastOrderNumber + 1;
  } catch (error) {
    console.error("Error al obtener el próximo número de pedido:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const {
      name,
      size,
      workshop,
      total_quantity,
      order_date,
      rollcuts,
      rolldetails,
    } = await req.json();

    if (
      !name ||
      !size ||
      !workshop ||
      !total_quantity ||
      !order_date ||
      !rollcuts ||
      !rolldetails
    ) {
      return NextResponse.json(
        { message: "Provide all the data" },
        { status: 422 }
      );
    }

    await connectToDatabase();

    // Pedido autoincremental
    const orderNumber = await getNextOrderNumber();

    const sizeString = size.join(", ");
    const roll = await prisma.roll.create({
      data: {
        order_number: orderNumber,
        name,
        size: sizeString,
        workshop,
        total_quantity,
        order_date,
        rollcuts: { createMany: { data: rollcuts } },
        rolldetails: { createMany: { data: rolldetails } },
      },
    });

    return NextResponse.json({ roll }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
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
