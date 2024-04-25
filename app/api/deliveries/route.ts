import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function PUT(req: Request) {
  try {
    const requestData = await req.json();

    if (!Array.isArray(requestData) || requestData.length === 0) {
      return NextResponse.json(
        { message: "Provide an array of cut objects" },
        { status: 422 }
      );
    }

    await connectToDatabase();

    const responses = [];

    for (const { id, operation, amount } of requestData) {
      if (!id) {
        responses.push({
          message: "ID is missing for a cut",
          status: 422,
        });
        continue;
      }

      if (!operation || !amount) {
        responses.push({
          message: "Operation or amount is missing for a cut",
          status: 422,
        });
        continue;
      }

      const existingCut = await prisma.rollCuts.findUnique({ where: { id } });

      if (!existingCut) {
        responses.push({
          message: `The cut with ID ${id} does not exist`,
          status: 404,
        });
        continue;
      }

      let updatedDelivered;

      if (operation === "add") {
        // Calculate the updated delivered amount
        updatedDelivered = existingCut.delivered + amount;

        // Ensure delivered amount is never less than 0
        updatedDelivered = Math.max(updatedDelivered, 0);

        // Ensure delivered amount is never greater than quantity
        updatedDelivered = Math.min(updatedDelivered, existingCut.quantity);

        const updatedCut = await prisma.rollCuts.update({
          where: { id },
          data: { delivered: updatedDelivered },
        });

        responses.push({
          updated: updatedCut,
          status: 200,
        });
      } else {
        responses.push({
          message: `Invalid operation '${operation}' for cut ${id}. Use 'add' operation only`,
          status: 422,
        });
        continue;
      }
    }

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
