import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { connectToDatabase } from "@/prisma/server-helpers";
import { getServerSession } from "next-auth";

async function getSession(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return null; // Devolver null si no hay sesión de usuario
  }
  return session;
}

export async function POST(req: Request) {
  try {
    // Verificar si los datos son JSON válido
    const contentType = req.headers.get("content-type");
    const webhookSource = req.headers.get("x-wc-webhook-source");

    if (webhookSource !== "https://bleemar.com/") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(contentType);
    if (contentType?.includes("application/json")) {
      const shippingData: {
        id: number;
        date_created: string;
        billing: {
          first_name: string;
          address_1: string;
          postcode: string;
          city: string;
          state: string;
        };
        meta_data: { key: string; value: string }[];
        payment_method: string;
        customer_note: string;
      } = await req.json();

      console.log(shippingData);

      if (shippingData.payment_method === "yith_pos_cash_gateway") {
        return NextResponse.json({
          message: "Postnet purchase, data not saved",
        });
      }

      const { first_name, address_1, postcode, city, state } =
        shippingData.billing;

      const shipping_order = shippingData.id;
      const date = shippingData.date_created;

      const dni =
        shippingData.meta_data.find((meta) => meta.key === "_billing_dni")
          ?.value || "";

      const transport =
        shippingData.meta_data.find(
          (meta) => meta.key === "_billing_transporte"
        )?.value || "";

      const customer_note = shippingData.customer_note;

      await connectToDatabase();
      const shipping = await prisma.shipping.create({
        data: {
          shipping_order,
          date,
          name: first_name,
          address: address_1,
          zip: postcode,
          city,
          province: state,
          dni,
          transport,
          customer_note,
        },
      });

      return NextResponse.json({ shipping });
    } else {
      return NextResponse.json("Expected application/json. Webhook config.");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating shipping object" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const data = await prisma.shipping.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error getting shipping objects" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
