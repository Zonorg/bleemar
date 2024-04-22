// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import { Buffer } from "buffer";
// import { NextResponse } from "next/server";

// interface Roll {
//   order_number: number;
//   name: string;
//   workshop: string;
//   total_quantity: number;
//   order_date: string;
// }

// export async function POST(req: Request) {
//   try {
//     const { rolls } = await req.json();
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage();

//     const { width, height } = page.getSize();
//     const fontSize = 12;
//     const padding = 50;
//     const textHeight = fontSize + padding;
//     let y = height - padding;

//     page.drawText("Nº Pedido", { x: padding, y, size: fontSize });
//     page.drawText("Nombre", { x: padding + 100, y, size: fontSize });
//     page.drawText("Taller", { x: padding + 200, y, size: fontSize });
//     page.drawText("Cantidad total", { x: padding + 300, y, size: fontSize });
//     page.drawText("Fecha del pedido", { x: padding + 400, y, size: fontSize });

//     y -= textHeight;

//     rolls.forEach((roll: Roll) => {
//       y -= textHeight;
//       page.drawText(roll.order_number.toString(), {
//         x: padding,
//         y,
//         size: fontSize,
//       });
//       page.drawText(roll.name, { x: padding + 100, y, size: fontSize });
//       page.drawText(roll.workshop, { x: padding + 200, y, size: fontSize });
//       page.drawText(roll.total_quantity.toString(), {
//         x: padding + 300,
//         y,
//         size: fontSize,
//       });
//       page.drawText(roll.order_date, { x: padding + 400, y, size: fontSize });
//     });

//     // Guardar el PDF en un buffer
//     const pdfBytes = await pdfDoc.save();

//     // Crear una URL de datos para el PDF generado
//     const pdfDataUri = `data:application/pdf;base64,${Buffer.from(
//       pdfBytes
//     ).toString("base64")}`;

//     return NextResponse.json({ pdfUrl: pdfDataUri }, { status: 200 });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
