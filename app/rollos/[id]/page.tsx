"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import Link from "next/link";

export default function RollDetails() {
  const [rollData, setRollData] = useState<any>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/rollos/${id}`);
        const data = await response.json();
        setRollData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);
  return (
    <div className="w-full px-4 py-4 h-screen flex flex-col gap-5">
      <h3 className="text-xl font-bold">Detalles del pedido</h3>
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº Pedido</th>
            <th className="px-4 py-2 text-start">Nombre</th>
            <th className="px-4 py-2 text-start">Color</th>
            <th className="px-4 py-2 text-start">Combinado</th>
            <th className="px-4 py-2 text-start">Forro</th>
            <th className="px-4 py-2 text-start">Taller</th>
            <th className="px-4 py-2 text-start">Talles</th>
            <th className="px-4 py-2 text-start">Cantidad</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {rollData && (
            <tr className="border-b">
              <td className="px-4 py-2">{rollData.order_number}</td>
              <td className="px-4 py-2">{rollData.name}</td>
              <td className="px-4 py-2">{rollData.color}</td>
              <td className="px-4 py-2">{rollData.combined}</td>
              <td className="px-4 py-2">{rollData.lining}</td>
              <td className="px-4 py-2">{rollData.workshop}</td>
              <td className="px-4 py-2">{rollData.size}</td>
              <td className="px-4 py-2">{rollData.total_quantity}</td>
              <td className="px-4 py-2">
                {new Date(rollData.order_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <PiPencilSimpleLineFill size={20} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <Link
          href="/rollos"
          className="bg-green-s text-white font-bold px-4 py-2 rounded"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
