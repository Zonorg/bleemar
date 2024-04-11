import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function GET(req: Request, { params }: { params: any }) {
  console.log("Params: ", params);

  try {
    await connectToDatabase();
    console.log("Database connected");
    const cutId = String(params.id);

    const data = await prisma.roll.findUnique({
      where: {
        id: cutId,
      },
      select: {
        id: true,
        name: true,
        order_number: true,
        color: true,
        combined: true,
        lining: true,
        size: true,
        workshop: true,
        total_quantity: true,
        order_date: true,
      },
    });

    if (data) {
      console.log("Data: ", data);
      return NextResponse.json(data);
    } else {
      console.log("No cut found with ID: ", cutId);
      return NextResponse.json({ message: "No cut found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching cut: ", error);
    return NextResponse.json(
      { message: "Server error", error: error },
      { status: 500 }
    );
  } finally {
    console.log("Database disconnected");
    await prisma.$disconnect();
  }
}
