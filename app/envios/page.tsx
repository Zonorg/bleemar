"use client";

import ShippingData from "./components/shipping-data";

export default function Envios() {
  return (
    <div className="w-full px-4 h-screen">
      <div className="flex justify-between items-center px-4 py-4">
        <h3 className="text-xl font-bold">Etiquetas de envíos</h3>
      </div>
      <ShippingData />
    </div>
  );
}
