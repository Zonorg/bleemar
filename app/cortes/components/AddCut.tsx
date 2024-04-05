"use client";
import { useState, useRef, FormEvent } from "react";
import { createCut } from "../actions";

export default function AddCut() {
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [totalQuantity, setTotalQuantity] = useState<number | string>("");
  const [cutDate, setCutDate] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    try {
      await createCut(formData);

      setColor("");
      setSize("");
      setTotalQuantity("");
      setCutDate("");

      alert("El corte se ha creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el corte:");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label>
        Color:
        <input
          type="text"
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Tamaño:
        <input
          type="text"
          name="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Cantidad total:
        <input
          type="number"
          name="total_quantity"
          value={totalQuantity}
          onChange={(e) => setTotalQuantity(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Fecha del corte:
        <input
          type="date"
          name="cut_date"
          value={cutDate}
          onChange={(e) => setCutDate(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Crear Corte</button>
    </form>
  );
}
