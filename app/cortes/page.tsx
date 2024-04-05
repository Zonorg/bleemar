"use client";

import AddCut from "./components/AddCut";
import CutData from "./components/CutData";

export default async function Cortes() {
  return (
    <div className="w-full px-4 h-screen">
      <div className="flex justify-between items-center px-4 py-4">
        <h3 className="text-xl font-bold">Historial de cortes</h3>
        <AddCut />
      </div>
      <CutData />
    </div>
  );
}
