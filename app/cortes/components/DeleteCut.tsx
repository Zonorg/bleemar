import { useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { FiLoader } from "react-icons/fi";

interface DeleteCutProps {
  id: number;
}

const DeleteCut: React.FC<DeleteCutProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este corte?"
    );

    if (!confirmDelete) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/cortes", {
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
      alert("Corte eliminado");
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
};

export default DeleteCut;
