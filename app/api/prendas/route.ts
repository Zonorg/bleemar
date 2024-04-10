import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";
import { getServerSession } from "next-auth";

async function getSession() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorize" }, { status: 401 });
  }
  return session;
}

export async function GET() {
  try {
    await connectToDatabase();
    const data = await prisma.order.findMany({
      select: {
        id: true,
        title: true,
        gender: true,
        total_quantity: true,
        order_date: true,
        size: true,
        garmentcuts: true,
        details: true,
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
    await getSession();
    const {
      title,
      gender,
      size,
      workshop,
      total_quantity,
      order_date,
      garmentcuts,
      details,
    } = await req.json();
    if (
      !title ||
      !gender ||
      !size ||
      !workshop ||
      !total_quantity ||
      !order_date ||
      !garmentcuts ||
      !details
    )
      return NextResponse.json(
        { message: "Ingresa los datos correctamente" },
        { status: 422 }
      );
    await connectToDatabase();
    const order = await prisma.order.create({
      data: {
        title,
        gender,
        size,
        total_quantity,
        workshop,
        order_date,
        garmentcuts: { createMany: { data: garmentcuts } },
        details: { createMany: { data: details } },
      },
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
    await getSession();
    const { id } = await req.json();
    if (!id)
      return NextResponse.json(
        { message: "Ingresa el id correctamente" },
        { status: 422 }
      );

    await connectToDatabase();

    await prisma.garmentcuts.deleteMany({
      where: {
        orderId: id,
      },
    });

    await prisma.details.deleteMany({
      where: {
        orderId: id,
      },
    });

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
