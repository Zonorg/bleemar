import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/prisma/server-helpers";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Obtener los datos de RollCutSizes
    const rollCutSizes = await prisma.rollCutSizes.findMany();

    return NextResponse.json(rollCutSizes, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}

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

    for (const { id, operation, sizes } of requestData) {
      // Validar datos de entrada...
      if (!id) {
        responses.push({
          message: "ID is missing for a cut",
          status: 422,
        });
        continue;
      }

      if (!operation || !["add"].includes(operation)) {
        responses.push({
          message: `Invalid operation '${operation}' for cut ${id}. Use 'add' operation only`,
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

      if (operation === "add") {
        // Calcular la cantidad total entregada sumando las cantidades de los tamaños
        const totalDelivered = Object.values<number>(sizes).reduce(
          (total: number, current: number) => total + current,
          0
        );

        // Calcular la cantidad total entregada después de la actualización
        const updatedDelivered = existingCut.delivered + totalDelivered;

        // Asegurar que la cantidad entregada no exceda la cantidad total
        const newDelivered = Math.min(updatedDelivered, existingCut.quantity);

        // Asegurar que la cantidad entregada no sea menor que 0
        const finalDelivered = Math.max(newDelivered, 0);

        // Actualizar la cantidad entregada en el modelo RollCuts
        const updatedCut = await prisma.rollCuts.update({
          where: { id },
          data: { delivered: finalDelivered },
        });

        // Actualizar las cantidades individuales de cada talla en el modelo RollCutSizes
        for (const [size, quantity] of Object.entries(sizes)) {
          const existingRollCutSize = await prisma.rollCutSizes.findFirst({
            where: {
              cutId: id,
              size,
            },
          });

          if (existingRollCutSize) {
            // Si ya existe una entrada para esta talla, actualizamos la cantidad
            await prisma.rollCutSizes.update({
              where: {
                id: existingRollCutSize.id,
              },
              data: {
                quantity: existingRollCutSize.quantity + Number(quantity),
              },
            });
          } else {
            // Si no existe una entrada para esta talla, la creamos
            await prisma.rollCutSizes.create({
              data: {
                cutId: id,
                size,
                quantity: Number(quantity),
              },
            });
          }
        }

        responses.push({
          updated: updatedCut,
          status: 200,
        });
      }
    }

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
