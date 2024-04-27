import { useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";

interface DeleteRollProps {
  id: string;
}

export default function DeleteRoll({ id }: DeleteRollProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este pedido?"
    );

    if (!confirmDelete) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/rollos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.reload();
      alert("Pedido eliminado");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? <FiLoader className="animate-spin" /> : <BsFillTrashFill />}
    </button>
  );
}
