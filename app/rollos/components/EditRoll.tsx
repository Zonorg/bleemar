import { useState, useEffect } from "react";

interface RollData {
  order_number: number;
  name: string;
  workshop: string;
  size: string;
  total_quantity: number;
  order_date: string;
  completed: boolean;
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
    completed: false,
    rollcuts: [],
    rolldetails: [],
    payments: [],
  });

  // Use useEffect to update editedData when rollData changes
  useEffect(() => {
    if (rollData) {
      setEditedData(rollData);
    }
  }, [rollData]);

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
            <th className="px-4 py-2 text-start border bg-zinc-100">
              Nombre de pedido
            </th>
            <th className="px-4 py-2 text-start border bg-zinc-100">Taller</th>
            <th className="px-4 py-2 text-start border bg-zinc-100">Talles</th>
            <th className="px-4 py-2 text-start border bg-zinc-100">
              Cantidad total
            </th>
            <th className="px-4 py-2 text-start border bg-zinc-100">
              Fecha del pedido
            </th>
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
                className="px-4 py-1 border w-full"
              />
            </td>
            <td>
              <input
                type="text"
                name="workshop"
                value={editedData.workshop}
                onChange={handleChange}
                className="px-4 py-1 border w-full"
              />
            </td>
            <td>
              <input
                type="text"
                name="size"
                value={editedData.size}
                onChange={handleChange}
                className="px-4 py-1 border w-full"
              />
            </td>
            <td>
              <input
                type="number"
                name="total_quantity"
                value={editedData.total_quantity}
                onChange={handleChange}
                className="px-4 py-1 border w-full"
              />
            </td>
            <td>
              <input
                type="text"
                name="order_date"
                value={editedData.order_date}
                onChange={handleChange}
                className="px-4 py-1 border w-full"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleSave}>Guardar cambios</button>
    </div>
  );
}
