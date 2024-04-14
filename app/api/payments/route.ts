import { connectToDatabase } from "@/prisma/server-helpers";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const signature = formData.get("signature") as string;
    const rollId = formData.get("rollId") as string;
    const amount = formData.get("amount") as string;
    const date = formData.get("date") as string;

    if (!signature || !rollId || !amount || !date) {
      return NextResponse.json(
        { message: "Datos incompletos" },
        { status: 422 }
      );
    }

    // Guardar la firma en la carpeta pública
    const fs = require("fs");
    const path = require("path");
    const publicFolderPath = "./public/signatures";
    const timestamp = Date.now();
    const fileName = `signature_${timestamp}.png`;

    const signatureFilePath = path.join(publicFolderPath, fileName);

    // Guardar la imagen en el sistema de archivos
    fs.writeFileSync(
      signatureFilePath,
      signature.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    // Crear un registro en el modelo Payments
    await connectToDatabase();
    const payment = await prisma.payments.create({
      data: {
        amount,
        date,
        signature: signatureFilePath,
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
