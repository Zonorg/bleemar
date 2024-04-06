"use client";
import { useState, FormEvent, ChangeEvent } from "react";

interface FormData {
  color: string;
  size: string;
  total_quantity: number;
  cut_date: string;
}

export default function AddCut() {
  const [formData, setFormData] = useState<FormData>({
    color: "",
    size: "",
    total_quantity: 0,
    cut_date: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const parsedValue = name === "total_quantity" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("/api/cortes", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Corte agregado ");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          className="p-1"
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
        />
        <input
          className="p-1"
          type="text"
          name="size"
          placeholder="Talle"
          value={formData.size}
          onChange={handleChange}
        />
        <input
          className="p-1"
          type="number"
          name="total_quantity"
          placeholder="Cantidad"
          value={formData.total_quantity}
          onChange={handleChange}
        />
        <input
          className="p-1"
          type="date"
          name="cut_date"
          placeholder="Cantidad"
          value={formData.cut_date}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-green-s text-white font-bold px-4 py-2 rounded-lg"
        >
          Agregar corte
        </button>
      </form>
    </div>
  );
}
