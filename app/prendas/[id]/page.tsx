"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import Link from "next/link";

interface RollData {
  order_number: number;
  name: string;
  color: string;
  combined: string;
  lining: string;
  workshop: string;
  size: string;
  total_quantity: number;
  order_date: string;
  rollcuts: {
    color: string;
    combined: string;
    lining: string;
    quantity: number;
  }[];
  rolldetails: { title: string; quantity: number }[];
}

export default function RollDetails() {
  const { id } = useParams<{ id: string }>();
  const [rollData, setRollData] = useState<RollData | null>(null);

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

  const sizeOrder: { [size: string]: number } = {
    S: 0,
    M: 1,
    L: 2,
    XL: 3,
    XXL: 4,
    XXXL: 5,
  };

  const sortedSizes = (sizes: string) => {
    const sizeArray = sizes.split(", ").map((size) => size.trim());
    return sizeArray.sort((a, b) => sizeOrder[a] - sizeOrder[b]);
  };

  const handleDeletePayment = async (paymentId: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este pago?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch("/api/payments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: paymentId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.reload();
      alert("Pago eliminado");
    } catch (error) {
      console.error("Error deleting payment", error);
    }
  };

  const addOneDay = (dateString: string) => {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    let newDateString = date.toLocaleDateString();
    return newDateString;
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Detalles del pedido</h2>
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº Pedido</th>
            <th className="px-4 py-2 text-start">Nombre</th>
            <th className="px-4 py-2 text-start">Taller</th>
            <th className="px-4 py-2 text-start">Talles</th>
            <th className="px-4 py-2 text-start">Cantidad total</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {rollData && (
            <tr>
              <td className="px-4 py-2">{rollData.order_number}</td>
              <td className="px-4 py-2">{rollData.name}</td>
              <td className="px-4 py-2">{rollData.workshop}</td>
              <td className="px-4 py-2">
                {sortedSizes(rollData.size).join(", ")}
              </td>
              <td className="px-4 py-2">{rollData.total_quantity}</td>
              <td className="px-4 py-2">{addOneDay(rollData.order_date)}</td>
              <td className="px-4 py-2">
                <PiPencilSimpleLineFill size={20} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="aditional_data flex gap-5 max-xl:flex-col">
        <div className="cuts flex flex-col gap-3">
          <h3 className="text-lg font-bold">Cortes</h3>
          <table className="w-128 bg-white rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-start">Color</th>
                <th className="px-4 py-2 text-start">Combinado</th>
                <th className="px-4 py-2 text-start">Forro</th>
                <th className="px-4 py-2 text-start">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {rollData?.rollcuts &&
                rollData.rollcuts.map((cut, cutIndex) => (
                  <tr key={cutIndex}>
                    <td className="px-4 py-2">{cut.color}</td>
                    <td className="px-4 py-2">{cut.combined}</td>
                    <td className="px-4 py-2">{cut.lining}</td>
                    <td className="px-4 py-2">{cut.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="details flex flex-col gap-3">
          <h3 className="text-lg font-bold">Detalles</h3>
          <table className="w-128 bg-white rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-start">Item</th>
                <th className="px-4 py-2 text-start">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {rollData?.rolldetails &&
                rollData.rolldetails.map((detail, cutIndex) => (
                  <tr key={cutIndex}>
                    <td className="px-4 py-2">{detail.title}</td>
                    <td className="px-4 py-2">{detail.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link
        href="/rollos"
        className="bg-green-s text-white font-bold px-4 py-2 rounded mx-auto"
      >
        Volver
      </Link>
    </div>
  );
}