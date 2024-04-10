"use client";
import { useEffect, useState } from "react";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import DeleteCut from "./DeleteCut";

interface Cut {
  id: number;
  color: string;
  size: string;
  total_quantity: number;
  cut_date: string;
}

export default function CutData() {
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  async function fetchData() {
    try {
      const res = await fetch("/api/cortes");
      if (res.ok) {
        const cuts = await res.json();
        setCuts(cuts);
      } else {
        console.error("Error fetching cuts:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching cuts:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCuts = cuts.filter(
    (cut) =>
      cut.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cut.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cut.total_quantity.toString().includes(searchTerm.toLowerCase()) ||
      cut.id.toString().includes(searchTerm.toLowerCase()) ||
      cut.cut_date.toString().includes(searchTerm)
  );

  return (
    <div className="overflow-x-auto max-h-128">
      <input
        type="text"
        placeholder="Buscar por corte, cantidad o fecha..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº</th>
            <th className="px-4 py-2 text-start">Color</th>
            <th className="px-4 py-2 text-start">Talle</th>
            <th className="px-4 py-2 text-start">Cantidad</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {filteredCuts.map((cut, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{cut.color}</td>
              <td className="px-4 py-2">{cut.size}</td>
              <td className="px-4 py-2">{cut.total_quantity}</td>
              <td className="px-4 py-2">
                {new Date(cut.cut_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 flex items-center gap-3">
                <PiPencilSimpleLineFill size={20} />
                <DeleteCut id={cut.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
