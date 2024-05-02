import { google } from "googleapis";
import stream from "stream";
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
        { message: "Provide all the data" },
        { status: 422 }
      );
    }

    // Crear un stream de lectura a partir del buffer
    const buffer = Buffer.from(
      signature.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    // Autenticar a Google Drive
    const auth = new google.auth.GoogleAuth({
      keyFile: "./app/utils/google_service.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    // Subir la imagen a Google Drive
    const fileMetadata = {
      name: `signature_${Date.now()}.png`,
      parents: ["14ZM9nrebwnm51BvuqbS-PL_vMcz60r-n"], // ID de la carpeta para guardar la imagen (hay que darle permisos a la carpeta con el mail de las credentials)
    };
    const media = {
      mimeType: "image/png",
      body: bufferStream,
    };
    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // La ID de la imagen subida es res.data.id
    console.log("Archivo subido con ID: ", res.data.id);

    // Crear un registro en el modelo Payments
    await connectToDatabase();
    const payment = await prisma.payments.create({
      data: {
        amount,
        date,
        signature: `https://drive.google.com/uc?export=view&id=${res.data.id}`, // Guardamos la URL de la imagen en Google Drive
        Roll: {
          connect: {
            id: rollId,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Data saved successfully", payment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Provide the ID properly" },
        { status: 422 }
      );
    }
    await connectToDatabase();
    const payment = await prisma.payments.delete({
      where: { id },
    });
    return NextResponse.json({ payment }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
