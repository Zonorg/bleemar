import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function PUT(req: Request) {
  try {
    const { id, amount, operation } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Provide the ID of the cut to update" },
        { status: 422 }
      );
    }

    if (!amount || !operation) {
      return NextResponse.json(
        { message: "Provide amount and operation (add or subtract)" },
        { status: 422 }
      );
    }

    await connectToDatabase();

    let updatedCut;

    const existingCut = await prisma.rollCuts.findUnique({ where: { id } });

    if (!existingCut) {
      return NextResponse.json(
        { message: "The specified cut does not exist" },
        { status: 404 }
      );
    }

    // Validar que el monto de delivered no pueda ser restado de 0
    if (operation === "subtract" && existingCut.delivered === 0) {
      return NextResponse.json(
        { message: "The delivered amount cannot be subtracted from 0" },
        { status: 422 }
      );
    }

    // Buscar el atributo quantity y comparar con delivered
    if (
      operation === "add" &&
      existingCut.quantity < existingCut.delivered + amount
    ) {
      return NextResponse.json(
        { message: "The delivered amount cannot exceed the quantity" },
        { status: 422 }
      );
    }

    if (operation === "add") {
      updatedCut = await prisma.rollCuts.update({
        where: { id },
        data: { delivered: existingCut.delivered + amount },
      });
    } else if (operation === "subtract") {
      updatedCut = await prisma.rollCuts.update({
        where: { id },
        data: { delivered: existingCut.delivered - amount },
      });
    } else {
      return NextResponse.json(
        { message: "Invalid operation. Use 'add' or 'subtract'" },
        { status: 422 }
      );
    }

    return NextResponse.json({ updated: updatedCut }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
