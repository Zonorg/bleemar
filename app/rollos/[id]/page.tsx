"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaDownload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Link from "next/link";
import Payments from "../components/Payments";
import Image from "next/image";
import { RoleRedirect } from "@/app/utils/redirect";
import EditRoll from "../components/EditRoll";
import Modal from "react-modal";
import PDFPreview from "@/app/prendas/components/PDFPreview";

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
  }[];
  rolldetails: { id: string; title: string; quantity: number }[];
  payments: { id: string; amount: string; date: string; signature: string }[];
}

export default function RollDetails() {
  const { id } = useParams<{ id: string }>();
  const [rollData, setRollData] = useState<RollData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

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

  const closePDFPreview = () => {
    setShowPDFPreview(false);
  };

  return (
    <>
      <RoleRedirect />
      {!editMode ? (
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
            <table className="w-full bg-white rounded-lg">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-start">Nº Pedido</th>
                  <th className="px-4 py-2 text-start">Nombre</th>
                  <th className="px-4 py-2 text-start">Taller</th>
                  <th className="px-4 py-2 text-start">Talles</th>
                  <th className="px-4 py-2 text-start">Cantidad total</th>
                  <th className="px-4 py-2 text-start">Fecha del pedido</th>
                  <th className="px-4 py-2 text-start">Estado</th>
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
                    <td className="px-4 py-2">
                      {addOneDay(rollData.order_date)}
                    </td>
                    <td className="p-2">
                      <span
                        className={
                          rollData.completed
                            ? "bg-green-500 p-2 text-white font-medium rounded-full"
                            : "bg-yellow-500 p-2 text-white font-medium rounded-full"
                        }
                      >
                        {rollData.completed ? "Pagado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-4 items-center">
                      <button onClick={handleEdit}>
                        <PiPencilSimpleLineFill size={20} />
                      </button>
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
              <h3 className="text-lg font-bold">Cortes</h3>
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="border-b">
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
              <button className="green_plain_button">+ Agregar entrega</button>
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
          <div className="details flex flex-col gap-3">
            <h3 className="text-lg font-bold">Pagos</h3>
            <table className="w-full bg-white rounded-lg">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-start">Monto</th>
                  <th className="px-4 py-2 text-start">Fecha</th>
                  <th className="px-4 py-2 text-start">Firma</th>
                  <th className="px-4 py-2 text-start">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rollData?.payments &&
                  rollData.payments.map((payment, payIndex) => (
                    <tr key={payIndex}>
                      <td className="px-4 py-2">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        }).format(parseFloat(payment.amount))}
                      </td>
                      <td className="px-4 py-2">{addOneDay(payment.date)}</td>
                      <td className="px-4 py-2">
                        <Image
                          src={payment.signature.replace("public", "")}
                          alt={`Pago ${payIndex + 1}`}
                          width={100}
                          height={100}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="blue_plain_button"
                          onClick={() => handleDeletePayment(payment.id)}
                        >
                          Eliminar pago
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex flex-col gap-3 items-start">
            <button onClick={toggleModal} className="green_plain_button">
              + Agregar pago
            </button>
            <Modal
              isOpen={showModal}
              onRequestClose={toggleModal}
              contentLabel="Add payment"
              ariaHideApp={false}
              style={{
                content: {
                  margin: "auto",
                  overflow: "auto",
                  width: "90vw",
                  height: "60vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },

                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                },
              }}
            >
              <Payments rollId={id} />
              <button
                className=" font-bold rounded absolute top-4 right-5"
                onClick={toggleModal}
              >
                <ImCross className="text-zinc-900" />
              </button>
            </Modal>
          </div>
          <Link href="/rollos" className="green_button font-medium mx-auto">
            Volver
          </Link>
        </div>
      ) : (
        <EditRoll rollData={rollData} />
      )}
    </>
  );
}
