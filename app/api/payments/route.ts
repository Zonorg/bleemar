import { connectToDatabase } from "@/prisma/server-helpers";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const { signature, rollId, amount, date } = await req.json();
    if (!signature || !rollId || !amount || !date) {
      return NextResponse.json(
        { message: "Datos incompletos" },
        { status: 422 }
      );
    }

    // Guardar la firma en la carpeta pública
    const fs = require("fs");
    const publicFolderPath = "./public";
    const signatureFilePath = `${publicFolderPath}/signature.png`;
    fs.writeFileSync(signatureFilePath, signature, "base64");

    // Crear un registro en el modelo Payments
    await connectToDatabase();
    const payment = await prisma.payments.create({
      data: {
        amount,
        date,
        signature: signatureFilePath, // Guardar la ruta del archivo de firma
        Roll: {
          connect: {
            id: rollId,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Firma y pago guardados correctamente", payment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar la firma y el pago:", error);
    return NextResponse.json({ message: "Error de servidor" }, { status: 500 });
  }
}
