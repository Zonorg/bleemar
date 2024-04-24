import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function GET(req: Request, { params }: { params: any }) {
  // console.log("Params: ", params);
  try {
    await connectToDatabase();
    // console.log("Database connected");
    const rollId = String(params.id);

    const data = await prisma.roll.findUnique({
      where: {
        id: rollId,
      },
      select: {
        id: true,
        name: true,
        order_number: true,
        size: true,
        workshop: true,
        total_quantity: true,
        order_date: true,
        completed: true,
        rollcuts: true,
        rolldetails: true,
        payments: true,
      },
    });

    if (data) {
      // console.log("Data: ", data);
      return NextResponse.json(data);
    } else {
      console.log("No data found with ID: ", rollId);
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return NextResponse.json(
      { message: "Server error", error: error },
      { status: 500 }
    );
  } finally {
    // console.log("Database disconnected");
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    // const rollId = String(params.id);
    // Tal vez en un futuro uso esto
    const { id, entityType } = await req.json();
    if (
      !id ||
      !entityType ||
      (entityType !== "rollCut" && entityType !== "rollDetail")
    )
      return NextResponse.json(
        {
          message:
            "Provide the ID and entityType properly ('rollCut' or 'rollDetail')",
        },
        { status: 422 }
      );

    await connectToDatabase();

    if (entityType === "rollCut") {
      await prisma.rollCuts.deleteMany({
        where: { id },
      });
    } else if (entityType === "rollDetail") {
      await prisma.rollDetails.deleteMany({
        where: { id },
      });
    }

    return NextResponse.json(
      { message: `${entityType} with the provided ID deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting entity:", error);
    return NextResponse.json(
      { message: "Failed to delete entity" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
