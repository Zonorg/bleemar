"use client";
import { useState, useEffect } from "react";
import { RollDataById } from "@/app/types";
import { useParams } from "next/navigation";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { FaFilePdf } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { GrStatusGoodSmall } from "react-icons/gr";
import Link from "next/link";
import Payments from "../components/payments";
import Image from "next/image";
import EditRoll from "../components/edit-roll";
import Modal from "react-modal";
import PDFPreview from "@/app/prendas/components/pdf-preview";
import { useSession } from "next-auth/react";

export default function RollDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [rollData, setRollData] = useState<RollDataById | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);

  //Para calcular la cantidad de talles y multiplicar la cantidad de cortes
  const rollSizes = rollData?.size || "";
  const sizesArray = rollSizes.replace(/\s/g, "").split(",");
  const sizesCount = sizesArray.filter((size) => size !== "").length;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

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

  const closeEdition = () => {
    setEditMode(false);
  };

  return (
    <>
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
                        <FaFilePdf />
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
                    {rollData?.rollcuts.some((cut) => cut.combined) && (
                      <th className="px-4 py-2 text-start">Combinado</th>
                    )}
                    {rollData?.rollcuts.some((cut) => cut.lining) && (
                      <th className="px-4 py-2 text-start">Forro</th>
                    )}
                    <th className="px-4 py-2 text-start">Cantidad</th>
                    <th className="px-4 py-2 text-start">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rollData?.rollcuts &&
                    rollData.rollcuts.map((cut, cutIndex) => (
                      <tr key={cutIndex}>
                        <td className="px-4 py-2">{cut.color}</td>
                        {cut.combined && (
                          <td className="px-4 py-2">{cut.combined}</td>
                        )}
                        {cut.lining && (
                          <td className="px-4 py-2">{cut.lining}</td>
                        )}
                        <td className="px-4 py-2">{cut.quantity}</td>
                        <td className="px-4 py-2">
                          {cut.delivered >= cut.quantity * sizesCount ? (
                            <GrStatusGoodSmall className="text-green-500" />
                          ) : (
                            <GrStatusGoodSmall className="text-yellow-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
          {session?.user?.name === "Admin" && (
            <div>
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
                          <td className="px-4 py-2">
                            {addOneDay(payment.date)}
                          </td>
                          <td className="px-4 py-2">
                            <Image
                              src={payment.signature}
                              alt={`Pago ${payIndex + 1}`}
                              width={75}
                              height={75}
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
                    className="font-bold rounded absolute top-4 right-5"
                    onClick={toggleModal}
                  >
                    <ImCross className="text-zinc-900" />
                  </button>
                </Modal>
              </div>
            </div>
          )}

          <Link href="/rollos" className="green_button font-medium mx-auto">
            Volver
          </Link>
        </div>
      ) : (
        <EditRoll rollData={rollData} closeEdition={closeEdition} />
      )}
    </>
  );
}
