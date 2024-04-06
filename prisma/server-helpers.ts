import { prisma } from ".";

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    throw new Error("No se puede conectar a la base de datos");
  }
};
