"use client";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import DeleteRoll from "./DeleteRoll";
// import { useSession } from "next-auth/react";
import Link from "next/link";

interface Roll {
  id: number;
  order_number: number;
  name: string;
  workshop: string;
  total_quantity: number;
  order_date: string;
}

export default function RollData() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const { data: session } = useSession();

  async function fetchData() {
    try {
      const res = await fetch("/api/rollos");
      if (res.ok) {
        const rolls = await res.json();
        setRolls(rolls);
      } else {
        console.error("Error fetching rolls:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching rolls:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRolls = rolls.filter(
    (roll) =>
      roll.order_number.toString().includes(searchTerm.toLowerCase()) ||
      roll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.workshop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roll.total_quantity.toString().includes(searchTerm.toLowerCase()) ||
      roll.order_date.toString().includes(searchTerm)
  );

  return (
    <div className="overflow-x-auto max-h-128">
      <input
        type="text"
        placeholder="Buscar pedido..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº Pedido</th>
            <th className="px-4 py-2 text-start">Nombre</th>
            <th className="px-4 py-2 text-start">Taller</th>
            <th className="px-4 py-2 text-start">Cantidad total</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {filteredRolls.map((roll, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{roll.order_number}</td>
              <td className="px-4 py-2">{roll.name}</td>
              <td className="px-4 py-2">{roll.workshop}</td>
              <td className="px-4 py-2">{roll.total_quantity}</td>
              <td className="px-4 py-2">
                {new Date(roll.order_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 flex items-center gap-3">
                <Link href={`/rollos/${roll.id}`}>
                  <FaEye size={20} />
                </Link>
                {/* {session?.role === "Admin" && <DeleteRoll id={roll.id} />} */}
                <DeleteRoll id={roll.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
