import { prisma } from "@/prisma/prisma";

async function getData() {
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

  return data;
}

export default async function page() {
  const data = await getData();
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cortes</h1>
      <div className="grid grid-cols-2 gap-4">
        {data.map((cut, id) => (
          <div key={id} className="p-4 border rounded shadow">
            <p className="text-sm">Color: {id + 1}</p>
            <p className="text-sm">Color: {cut.color}</p>
            <p className="text-sm">Size: {cut.size}</p>
            <p className="text-sm">Total Quantity: {cut.total_quantity}</p>
            <p className="text-sm">Cut Date: {cut.cut_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
