"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";

export async function createCut(formData: FormData) {
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;
  const total_quantity = formData.get("total_quantity") as string;
  const cut_date = formData.get("cut_date") as string;

  await prisma.cut.create({
    data: {
      color: color,
      size: size,
      total_quantity: parseInt(total_quantity),
      cut_date: cut_date,
    },
  });

  revalidatePath("/");
}
