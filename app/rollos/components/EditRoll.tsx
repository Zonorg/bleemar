import { useState, useEffect } from "react";
import RollData from "../page";

interface RollData {
  id: string;
  order_number: number;
  name: string;
  workshop: string;
  size: string | string[];
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
  [key: string]: any;
}
interface Props {
  rollData: RollData | null;
  closeEdition: () => void;
}

export default function EditRoll({ rollData, closeEdition }: Props) {
  const [editedData, setEditedData] = useState<RollData>({
    id: "",
    order_number: 0,
    name: "",
    workshop: "",
    size: [],
    total_quantity: 0,
    order_date: "",
    completed: false,
    rollcuts: [],
    rolldetails: [],
    payments: [],
  });

  useEffect(() => {
    if (rollData) {
      const newSize = Array.isArray(rollData.size)
        ? rollData.size
        : rollData.size.split(",");
      setEditedData({ ...rollData, size: newSize });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    nestedKey?: string
  ) => {
    const { name, value, type } = e.target;
    let processedValue: any;

    if (type === "number") {
      processedValue = Number(value);
    } else if (name === "size") {
      processedValue = value.split(",");
    } else if (name === "completed") {
      processedValue = value === "true";
    } else {
      processedValue = value;
    }

    if (index !== undefined && nestedKey !== undefined) {
      setEditedData((prevData) => {
        const updatedNestedObject = {
          ...prevData[nestedKey][index],
          [name]: processedValue,
        };
        return {
          ...prevData,
          [nestedKey]: [
            ...prevData[nestedKey].slice(0, index),
            updatedNestedObject,
            ...prevData[nestedKey].slice(index + 1),
          ],
        };
      });
    } else {
      setEditedData((prevData) => ({ ...prevData, [name]: processedValue }));
    }
  };

  const handleDelete = async (id: string, entityType: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este dato?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`/api/rollos/${editedData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, entityType }),
      });

      if (response.ok) {
        alert("Elemento eliminado correctamente");
        if (entityType === "rollCut") {
          setEditedData((prevData) => ({
            ...prevData,
            rollcuts: prevData.rollcuts.filter((rollcut) => rollcut.id !== id),
          }));
        } else if (entityType === "rollDetail") {
          setEditedData((prevData) => ({
            ...prevData,
            rolldetails: prevData.rolldetails.filter(
              (rolldetail) => rolldetail.id !== id
            ),
          }));
        }
      } else {
        alert("Error al eliminar el elemento");
        const responseData = await response.json();
        console.log(responseData);
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el elemento");
    }
  };

  const handleSave = async () => {
    try {
      if (editedData) {
        const { id, rollcuts, rolldetails, ...rest } = editedData;

        console.log("Data:", { id, ...rest, rollcuts, rolldetails });

        const response = await fetch(`/api/rollos`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...rest, rollcuts, rolldetails }),
        });

        if (response.ok) {
          alert("Pedido editado correctamente");
          window.location.reload();
        } else {
          alert("Revisa los datos");
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
                type="date"
                name="order_date"
                value={editedData.order_date}
                onChange={handleChange}
                className="px-4 py-2 w-full"
              />
            </td>
            <td>
              <select
                name="completed"
                onChange={handleChange}
                value={editedData.completed ? "true" : "false"}
                className="p-1 border h-10"
              >
                <option value="false">Pendiente</option>
                <option value="true">Pagado</option>
              </select>
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
                  name="color"
                  value={rollcut.color}
                  onChange={(e) => handleChange(e, index, "rollcuts")}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="combined"
                  value={rollcut.combined}
                  onChange={(e) => handleChange(e, index, "rollcuts")}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="lining"
                  value={rollcut.lining}
                  onChange={(e) => handleChange(e, index, "rollcuts")}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={rollcut.quantity}
                  onChange={(e) => handleChange(e, index, "rollcuts")}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <button
                  className="delete_plain_button"
                  onClick={() => handleDelete(rollcut.id, "rollCut")}
                >
                  Eliminar
                </button>
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
                  name="title"
                  value={rolldetail.title}
                  onChange={(e) => handleChange(e, index, "rolldetails")}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={rolldetail.quantity}
                  onChange={(e) => handleChange(e, index, "rolldetails")}
                  className="px-4 py-2 w-full"
                />
              </td>
              <td>
                <button
                  className="delete_plain_button"
                  onClick={() => handleDelete(rolldetail.id, "rollDetail")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex m-auto gap-5">
        <button className="green_button" onClick={handleSave}>
          Guardar cambios
        </button>
        <button
          className="blue_plain_button"
          onClick={() => {
            closeEdition();
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
