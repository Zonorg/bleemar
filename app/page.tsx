// import { prisma } from "@/prisma/prisma";

// async function getData() {
//   const data = await prisma.cut.findMany({
//     select: {
//       id: true,
//       color: true,
//       size: true,
//       total_quantity: true,
//       cut_date: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return data;
// }

// export default async function Page() {
//   const data = await getData();
//   return (
//     <div className="container mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Cortes</h1>
//       <div className="grid grid-cols-2 gap-4">
//         {data.map((cut, index) => (
//           <div key={index} className="p-4 border rounded shadow">
//             <p className="text-sm">Color: {cut.color}</p>
//             <p className="text-sm">Size: {cut.size}</p>
//             <p className="text-sm">Total Quantity: {cut.total_quantity}</p>
//             <p className="text-sm">Cut Date: {cut.cut_date}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

interface Cut {
  id: number;
  color: string;
  size: string;
  total_quantity: number;
  cut_date: string;
}

export default function Page() {
  const [cuts, setCuts] = useState<Cut[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/cortes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCuts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cortes</h1>
      <div className="grid grid-cols-2 gap-4">
        {cuts.map((cut, index) => (
          <div key={index} className="p-4 border rounded shadow">
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
