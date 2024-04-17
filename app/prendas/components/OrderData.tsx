import { useEffect, useState } from "react";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import DeleteOrder from "./DeleteOrder";

interface Order {
  id: number;
  title: string;
  total_quantity: number;
  order_date: string;
  garmentcuts: {
    color: string;
    combined: string;
    lining: string;
    quantity: number;
  }[];
  details: {
    title: string;
    quantity: number;
  }[];
}

export default function OrderData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  async function fetchData() {
    try {
      const res = await fetch("/api/prendas");
      if (res.ok) {
        const orders = await res.json();
        setOrders(orders);
      } else {
        console.error("Error fetching orders:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(order.order_date)
        .toLocaleDateString()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto max-h-128">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº</th>
            <th className="px-4 py-2 text-start">Pedido</th>
            <th className="px-4 py-2 text-start">Cantidad</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
            <th className="px-4 py-2 text-start">Taller</th>
            <th className="px-4 py-2 text-start">Cortes de Prenda</th>
            <th className="px-4 py-2 text-start">Detalles</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {filteredOrders.map((order, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{order.title}</td>
              <td className="px-4 py-2">{order.total_quantity}</td>
              <td className="px-4 py-2">
                {new Date(order.order_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">Taller</td>
              <td className="px-4 py-2">
                <ul>
                  {order.garmentcuts.map((cut, cutIndex) => (
                    <li key={cutIndex}>
                      Color: {cut.color}, Cantidad: {cut.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2">
                <ul>
                  {order.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>
                      Título: {detail.title}, Cantidad: {detail.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2 flex items-center gap-3">
                <PiPencilSimpleLineFill size={20} />
                <DeleteOrder id={order.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
