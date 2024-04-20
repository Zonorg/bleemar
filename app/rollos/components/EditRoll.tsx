import { useParams } from "next/navigation";
import { useState } from "react";

interface RollData {
  order_number: number;
  name: string;
  workshop: string;
  size: string;
  total_quantity: number;
  order_date: string;
  color: string;
  combined: string;
  lining: string;
  rollcuts: {
    color: string;
    combined: string;
    lining: string;
    quantity: number;
  }[];
  rolldetails: { title: string; quantity: number }[];
  payments: { id: string; amount: string; date: string; signature: string }[];
}

interface Props {
  rollData: RollData | null;
  onSave: (data: RollData) => void;
}

export default function EditRoll({ rollData, onSave }: Props) {
  const [editedData, setEditedData] = useState<RollData>({
    order_number: 0,
    name: "",
    workshop: "",
    size: "",
    total_quantity: 0,
    order_date: "",
    color: "",
    combined: "",
    lining: "",
    rollcuts: [],
    rolldetails: [],
    payments: [],
  });

  if (!rollData) {
    return <div>Cargando...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Editar pedido</h2>
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº Pedido</th>
            <th className="px-4 py-2 text-start">Nombre</th>
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
              />
            </td>
            <td>
              <input
                type="text"
                name="workshop"
                value={editedData.workshop}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="size"
                value={editedData.size}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="total_quantity"
                value={editedData.total_quantity}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="order_date"
                value={editedData.order_date}
                onChange={handleChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleSave}>Guardar cambios</button>
    </div>
  );
}
