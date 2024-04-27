"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import Link from "next/link";
import PDFPreview from "../components/PDFPreview";

interface RollData {
  id: string;
  order_number: number;
  name: string;
  workshop: string;
  size: string;
  total_quantity: number;
  order_date: string;
  completed: boolean;
  rollcuts: {
    id: string;
    color: string;
    combined: string;
    lining: string;
    quantity: number;
    delivered: number;
    rollCutSizes: RollCutSize[];
  }[];
  rolldetails: { id: string; title: string; quantity: number }[];
}

interface RollCutSize {
  id: string;
  cutId: string;
  size: string;
  quantity: number;
  createdAt: string;
}

export default function RollDetails() {
  const { id } = useParams<{ id: string }>();
  const [rollData, setRollData] = useState<RollData | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [cutId: string]: number }>({});

  const [sizes, setSizes] = useState<{
    [cutId: string]: { [size: string]: number };
  }>({});

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/rollos/${id}`);
      const data = await response.json();
      setRollData(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSizeQuantityChange = (
    cutId: string,
    size: string,
    quantity: number
  ) => {
    setSizes((prevSizes) => ({
      ...prevSizes,
      [cutId]: {
        ...prevSizes[cutId],
        [size]: quantity,
      },
    }));
  };

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

  const addOneDay = (dateString: string) => {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    let newDateString = date.toLocaleDateString();
    return newDateString;
  };

  const closePDFPreview = () => {
    setShowPDFPreview(false);
  };

  const handleAddDeliveries = async () => {
    try {
      // Extraer los datos antes de enviarlos
      const requestData = Object.entries(sizes).map(([id, sizeQuantities]) => ({
        id,
        operation: "add",
        sizes: sizeQuantities,
      }));

      // Hacer un console.log de los datos antes de enviarlos
      console.log("Datos que se están enviando:", requestData);

      const response = await fetch("/api/deliveries/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        alert("Revisa los datos");
        console.log(response.status);
        throw new Error("Network response was not ok");
      }

      if (response.ok) {
        alert("Entregas actualizadas");
        setSizes({});
      }

      const data = await response.json();
      console.log(data);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-[85vh] px-4 py-4 flex flex-col gap-5">
      {showPDFPreview && rollData && (
        <div>
          <PDFPreview
            rollData={[rollData]}
            addOneDay={addOneDay}
            closePDFPreview={closePDFPreview}
          />
        </div>
      )}
      <div className="flex flex-col gap-3 overflow-x-auto">
        <h2 className="text-xl font-bold">Detalles del pedido</h2>
        <table className="bg-white rounded-lg w-full">
          <thead>
            <tr className="border-b">
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
                  <button
                    onClick={() => {
                      setShowPDFPreview(true);
                    }}
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="aditional_data flex flex-col gap-5">
        <div className="cuts flex flex-col gap-3 overflow-x-auto">
          <h3 className="text-lg font-bold">Entregas</h3>
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-start">Corte</th>
                <th className="px-4 py-2 text-start">Cantidad</th>
                <th className="px-4 py-2 text-start">Estado</th>
                {rollData?.rollcuts[0]?.rollCutSizes.map((size, index) => (
                  <th key={index} className="px-4 py-2 text-start">
                    {size.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rollData?.rollcuts.map((cut, cutIndex) => (
                <tr key={cutIndex}>
                  <td className="px-4 py-2">{cut.color}</td>
                  <td className="px-4 py-2">{cut.quantity}</td>
                  <td className="px-4 py-2">
                    {cut.delivered === cut.quantity ? (
                      <GrStatusGoodSmall className="text-green-500" />
                    ) : (
                      <GrStatusGoodSmall className="text-yellow-500" />
                    )}
                  </td>
                  {cut.rollCutSizes.map((size, sizeIndex) => (
                    <td key={sizeIndex} className="px-4 py-2">
                      {size.quantity}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-start">Corte</th>
                <th className="px-4 py-2 text-start">Entregado</th>
                <th className="px-4 py-2 text-start">Entregar Talles</th>
              </tr>
            </thead>
            <tbody>
              {rollData?.rollcuts &&
                rollData.rollcuts.map((cut, cutIndex) => (
                  <tr key={cutIndex}>
                    <td className="px-4 py-2">{cut.color}</td>
                    <td className="px-4 py-2">{cut.delivered}</td>
                    {sortedSizes(rollData.size).map((size, index) => (
                      <td className="px-4 py-2" key={index}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {size}
                        </label>
                        <input
                          type="number"
                          className="px-4 py-1 border rounded"
                          value={sizes[cut.id]?.[size] || ""}
                          onChange={(e) =>
                            handleSizeQuantityChange(
                              cut.id,
                              size,
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <button
            onClick={handleAddDeliveries}
            className="green_plain_button m-auto"
          >
            + Agregar entregas
          </button>
        </div>

        <div className="details flex flex-col gap-3 overflow-x-auto">
          <h3 className="text-lg font-bold">Detalles</h3>
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b">
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
        className="bg-green-s hover:bg-green-m text-white font-bold px-4 py-2 rounded mx-auto"
      >
        Volver
      </Link>
    </div>
  );
}
