import { useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";

interface DeleteOrderProps {
  id: number;
}

export default function DeleteOrder({ id }: DeleteOrderProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este pedido?"
    );

    if (!confirmDelete) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/prendas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Pedido eliminado");
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? <FiLoader /> : <BsFillTrashFill />}
    </button>
  );
}
