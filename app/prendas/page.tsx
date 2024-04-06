"use client";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import AddOrder from "./components/AddOrder";
import OrderData from "./components/OrderData";
import DeleteOrder from "./components/DeleteOrder";

interface Order {
  id: number;
  title: string;
  gender: string;
  total_quantity: number;
  order_date: string;
  isCompleted: boolean;
}

export default function Prendas() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchData();
  }, [orders]);

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

  return (
    <div className="overflow-x-auto">
      <AddOrder />
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-start">Nº</th>
            <th className="px-4 py-2 text-start">Pedido</th>
            <th className="px-4 py-2 text-start">Género</th>
            <th className="px-4 py-2 text-start">Cantidad</th>
            <th className="px-4 py-2 text-start">Fecha del pedido</th>
            <th className="px-4 py-2 text-start">Talleres</th>
            <th className="px-4 py-2 text-start">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {orders.map((order, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{order.title}</td>
              <td className="px-4 py-2">{order.gender}</td>
              <td className="px-4 py-2">{order.total_quantity}</td>
              <td className="px-4 py-2">Taller</td>
              <td className="px-4 py-2">
                {new Date(order.order_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 flex items-center gap-1">
                <PiPencilSimpleLineFill size={20} />
                <FaEye size={20} />
                {/* <DeleteOrder order={order} /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
