import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.cut.findMany({
    select: {
      id: true,
      color: true,
      size: true,
      total_quantity: true,
      cut_date: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(data);
}
