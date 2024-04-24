import { useState, useEffect } from "react";
import RollData from "../page";

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

interface Props {
  rollData: RollData | null;
}

export default function EditRoll({ rollData }: Props) {
  const [editedData, setEditedData] = useState<RollData>({
    id: "",
    order_number: 0,
    name: "",
    workshop: "",
    size: "",
    total_quantity: 0,
    order_date: "",
    completed: false,
    rollcuts: [],
    rolldetails: [],
    payments: [],
  });

  useEffect(() => {
    if (rollData) {
      setEditedData(rollData);
    }
  }, [rollData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]:
        type === "number"
          ? Number(value)
          : name === "size"
          ? value.split(",")
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (editedData) {
        const { id, rollcuts, rolldetails, ...rest } = editedData; // Extraer id, rollcuts y rolldetails del objeto editedData

        // Imprimir los datos que se enviarán en la solicitud PUT
        console.log("Datos a enviar:", { id, ...rest, rollcuts, rolldetails });

        const response = await fetch(`/api/rollos`, {
          // Utilizar la URL sin el id en los parámetros
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...rest, rollcuts, rolldetails }), // Enviar todos los datos incluyendo id, rollcuts y rolldetails en el body
        });

        if (response.ok) {
          alert("Pedido editado correctamente");
          // Manejar cualquier lógica adicional aquí, si es necesario
        } else {
          console.log("La solicitud no fue exitosa");
          const responseData = await response.json();
          console.log(responseData);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error al editar el pedido, revisa todos los datos");
    }
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Editar pedido</h2>
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-start">Nombre de pedido</th>
            <th className="px-4 py-2 text-start">Taller</th>
            <th className="px-4 py-2 text-start">Talles</th>
            <th className="px-4 py-2 text-start">Cantidad total</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr>
            <td>
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleChange}
                className="px-4 py-2 w-full"
              />
            </td>
            <td>
              <input
                type="text"
                name="workshop"
                value={editedData.workshop}
                onChange={handleChange}
                className="px-4 py-2 w-full"
              />
            </td>
            <td>
              <input
                type="text"
                name="size"
                value={editedData.size}
                onChange={handleChange}
                className="px-4 py-2 w-full"
              />
            </td>
            <td>
              <input
                type="number"
                name="total_quantity"
                value={editedData.total_quantity}
                onChange={handleChange}
                className="px-4 py-2 w-full"
              />
            </td>
            <td>
              <input
                type="text"
                name="order_date"
                value={editedData.order_date}
                onChange={handleChange}
                className="px-4 py-2 w-full"
              />
            </td>
          </tr>
        </tbody>
      </table>
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
          {editedData.rollcuts.map((rollcut, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="rollcut_color"
                  value={rollcut.color}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="rollcut_combined"
                  value={rollcut.combined}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="rollcut_lining"
                  value={rollcut.lining}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="rollcut_quantity"
                  value={rollcut.quantity}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-start">Detalle</th>
            <th className="px-4 py-2 text-start">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {editedData.rolldetails.map((rolldetail, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="rolldetail_title"
                  value={rolldetail.title}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="rolldetail_quantity"
                  value={rolldetail.quantity}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>Guardar cambios</button>
      <button
        onClick={() => {
          window.location.reload();
        }}
      >
        Cancelar
      </button>
    </div>
  );
}
