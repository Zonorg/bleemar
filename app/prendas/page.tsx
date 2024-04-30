"use client";
// import AddRoll from "../rollos/components/AddRoll";
import OrderData from "./components/OrderData";

export default function Cortes() {
  return (
    <div className="w-full px-4 h-screen">
      <div className="flex justify-between items-center px-4 py-4">
        <h3 className="text-xl font-bold">Historial de pedidos</h3>
        {/* <AddRoll /> */}
      </div>
      <OrderData />
    </div>
  );
}
