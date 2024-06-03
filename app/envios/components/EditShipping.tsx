"use client";
import { useState } from "react";
import { Shipping } from "./ShippingData";
import { FiLoader } from "react-icons/fi";

interface Props {
  selectedShipping: Shipping | null;
  closeEdition: () => void;
}

export default function EditShipping({
  selectedShipping,
  closeEdition,
}: Props) {
  const [formData, setFormData] = useState({
    id: selectedShipping?.id || "",
    address: selectedShipping?.address || "",
    completed: selectedShipping?.completed || false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "completed" ? value === "true" : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shipping", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        window.alert("Envío guardado");
        window.location.reload();
      } else {
        console.error("Error al guardar los datos");
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Envío</h2>
      <table className="w-full bg-white rounded-lg ">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-start">Nº Pedido</th>
            <th className="px-4 py-2 text-start">Cliente</th>
            <th className="px-4 py-2 text-start">Dirección</th>
            <th className="px-4 py-2 text-start">Estado</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr>
            <td className="px-4 py-2">{selectedShipping?.shipping_order}</td>
            <td className="px-4 py-2">{selectedShipping?.name}</td>
            <td className="px-4 py-2">{selectedShipping?.address}</td>
            {/* <td>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded-md p-2"
              />
            </td> */}

            <td>
              <select
                name="completed"
                value={formData.completed ? "true" : "false"}
                onChange={handleChange}
                className="border rounded-md p-2"
              >
                <option value="true">Enviado</option>
                <option value="false">Pendiente</option>
              </select>
            </td>
            <td>
              {loading ? (
                <FiLoader size={20} className="animate-spin mt-2" />
              ) : (
                <>
                  <button onClick={handleSave} className="green_button mr-2">
                    Guardar
                  </button>
                  <button onClick={closeEdition} className="blue_plain_button">
                    Cancelar
                  </button>
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
