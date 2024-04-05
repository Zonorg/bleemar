import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: any) {
  const res = await prisma.cut.findMany({
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

  return Response.json(res);
}
