"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FiLoader } from "react-icons/fi";
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
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sizes, setSizes] = useState<{
    [cutId: string]: { [size: string]: number };
  }>({});

  //Para calcular la cantidad de talles y multiplicar la cantidad de cortes
  const rollSizes = rollData?.size || "";
  const sizesArray = rollSizes.replace(/\s/g, "").split(",");
  const sizesCount = sizesArray.filter((size) => size !== "").length;

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
      const requestData = Object.entries(sizes).map(([id, sizeQuantities]) => ({
        id,
        operation: "add",
        sizes: sizeQuantities,
      }));
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setSizes({});
    }
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-5">
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
        <div className="cuts flex flex-col gap-3 overflow-x-auto overflow-y-hidden">
          <h3 className="text-lg font-bold">Entregas</h3>
          <table className="w-full bg-white rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-start">Corte</th>
                <th className="px-4 py-2 text-start">Cantidad</th>
                <th className="px-4 py-2 text-start">Total entregado</th>
                <th className="px-4 py-2 text-start">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rollData?.rollcuts.map((cut, cutIndex) => {
                cut.rollCutSizes.sort((a, b) => {
                  const sizeOrder = ["S", "M", "L", "XL", "XXL", "XXXL"];
                  return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
                });

                return (
                  <tr key={cutIndex}>
                    <td className="px-4 py-2">{cut.color}</td>
                    <td className="px-4 py-2">{cut.quantity * sizesCount}</td>
                    <td className="px-4 py-2">{cut.delivered}</td>
                    <td className="px-4 py-2">
                      {cut.delivered >= cut.quantity * sizesCount ? (
                        <GrStatusGoodSmall className="text-green-500" />
                      ) : (
                        <GrStatusGoodSmall className="text-yellow-500" />
                      )}
                    </td>
                    {cut.rollCutSizes.map((size, sizeIndex) => (
                      <td key={sizeIndex} className="px-4 py-2">
                        <strong>{size.size}</strong> {size.quantity}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {editMode && (
            <div className="edit_mode flex flex-col gap-5">
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-start">Corte</th>
                    <th className="px-4 py-2 text-start">Entregar Talles</th>
                  </tr>
                </thead>
                <tbody>
                  {rollData?.rollcuts &&
                    rollData.rollcuts.map((cut, cutIndex) => (
                      <tr key={cutIndex}>
                        <td className="px-4 py-2">{cut.color}</td>
                        {sortedSizes(rollData.size).map((size, index) => {
                          // Verificar si el talle actual ya se mapeo
                          if (
                            index === 0 ||
                            sortedSizes(rollData.size)[index] !==
                              sortedSizes(rollData.size)[index - 1]
                          ) {
                            return (
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
                            );
                          } else {
                            // Si el talle se repite, no duplicarlo
                            return null;
                          }
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
              {loading ? (
                <FiLoader className="animate-spin text-2xl text-zinc-500 m-auto" />
              ) : (
                <button
                  onClick={handleAddDeliveries}
                  className="green_button m-auto"
                >
                  + Agregar entregas
                </button>
              )}
            </div>
          )}
          {!loading && (
            <button
              onClick={handleEditMode}
              className={`${
                editMode ? "blue_plain_button" : "green_plain_button"
              } m-auto`}
            >
              {editMode ? "Cancelar" : "+ Agregar entregas"}
            </button>
          )}
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
        href="/prendas"
        className="bg-green-s hover:bg-green-m text-white font-bold px-4 py-2 rounded mx-auto"
      >
        Volver
      </Link>
    </div>
  );
}
