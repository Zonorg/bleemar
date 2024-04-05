"use client";
import { useState, useEffect } from "react";

interface Cut {
  id: number;
  color: string;
  size: string;
  total_quantity: number;
  cut_date: string;
}

export default function Page() {
  const [data, setData] = useState<Cut[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/cortes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
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
        {data.map((cut) => (
          <div key={cut.id} className="p-4 border rounded shadow">
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
