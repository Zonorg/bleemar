import { useState, FormEvent, ChangeEvent } from "react";
import Modal from "react-modal";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (e.target.tagName === "INPUT") {
      const parsedValue =
        name === "total_quantity" ? parseInt(value, 10) : value;
      setFormData({ ...formData, [name]: parsedValue });
    } else if (e.target.tagName === "SELECT") {
      setFormData({ ...formData, [name]: value });
    }
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
      if (response.status === 422) {
        alert("Rellena todos los campos");
        return;
      }
      if (response.ok) {
        alert("Corte agregado ");
        setFormData({
          color: "",
          size: "",
          total_quantity: 0,
          cut_date: "",
        });
        window.location.reload();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-green-s text-white font-bold px-4 py-2 rounded"
      >
        Agregar corte
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        contentLabel="Agregar Corte"
        style={{
          content: {
            maxHeight: "20vh",
            maxWidth: "60vw",
            margin: "auto",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex">
            <div className="flex flex-col">
              <label htmlFor="color" className="font-bold">
                Color
              </label>
              <input
                className="p-1 border h-9"
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="size" className="font-bold">
                Talle
              </label>
              <select
                className="p-1 border h-9"
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="">Seleccionar Talle</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="total_quantity" className="font-bold">
                Cantidad
              </label>
              <input
                className="p-1 border h-9"
                type="number"
                name="total_quantity"
                value={formData.total_quantity}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="cut_date" className="font-bold">
                Fecha
              </label>
              <input
                className="p-1 border h-9"
                type="date"
                name="cut_date"
                placeholder="Fecha de corte"
                value={formData.cut_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              type="submit"
              className="bg-green-s text-white font-bold px-4 py-2 rounded"
            >
              Agregar corte
            </button>
            <button
              onClick={() => setModalIsOpen(false)}
              className="border px-4 py-2 rounded font-bold"
            >
              Cerrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
