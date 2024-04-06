"use client";
import { useState, FormEvent, ChangeEvent } from "react";

interface FormData {
  title: string;
  gender: string;
  total_quantity: number;
  order_date: string;
  size: string;
}

export default function AddOder() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    gender: "",
    total_quantity: 0,
    order_date: "",
    size: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const parsedValue = name === "total_quantity" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("/api/prendas", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Pedido agregado");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-5">
        <input
          className="p-1"
          type="text"
          name="title"
          placeholder="Nombre del pedido"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          className="p-1"
          type="text"
          name="gender"
          placeholder="Género"
          value={formData.gender}
          onChange={handleChange}
        />
        <input
          className="p-1"
          type="text"
          name="size"
          placeholder="Talles"
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
          name="order_date"
          placeholder="Cantidad"
          value={formData.order_date}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-green-s text-white font-bold px-4 py-2 rounded-lg"
        >
          Agregar pedido
        </button>
      </form>
    </div>
  );
}
