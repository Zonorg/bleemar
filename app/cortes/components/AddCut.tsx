import { useState, FormEvent, ChangeEvent } from "react";
import Modal from "react-modal";

interface FormData {
  name: string;
  order_number: number;
  color: string;
  combined: string;
  lining: string;
  size: string;
  workshop: string;
  total_quantity: number;
  order_date: string;
}

export default function AddCut() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    order_number: 0,
    color: "",
    combined: "",
    lining: "",
    size: "",
    workshop: "",
    total_quantity: 0,
    order_date: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    let parsedValue: string | number | Date;

    switch (e.target.type) {
      case "number":
        parsedValue = parseInt(value, 10);
        break;
      default:
        parsedValue = value;
        break;
    }

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
      if (response.status === 422) {
        alert("Rellena todos los campos");
        return;
      }
      if (response.ok) {
        alert("Corte agregado ");
        setFormData({
          name: "",
          order_number: 0,
          color: "",
          combined: "",
          lining: "",
          size: "",
          workshop: "",
          total_quantity: 0,
          order_date: "",
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
              <label htmlFor="name" className="font-bold">
                Nombre
              </label>
              <input
                className="p-1 border h-9"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="order_number" className="font-bold">
                Número de pedido
              </label>
              <input
                className="p-1 border h-9"
                type="number"
                name="order_number"
                value={formData.order_number}
                onChange={handleChange}
              />
            </div>
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
              <label htmlFor="combined" className="font-bold">
                Combinado
              </label>
              <input
                className="p-1 border h-9"
                type="text"
                name="combined"
                value={formData.combined}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lining" className="font-bold">
                Forro
              </label>
              <input
                className="p-1 border h-9"
                type="text"
                name="lining"
                value={formData.lining}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="size" className="font-bold">
                Talles
              </label>
              <select
                className="p-1 border h-9"
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="">Seleccionar Talles</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="workshop" className="font-bold">
                Taller
              </label>
              <select
                className="p-1 border h-9"
                name="workshop"
                value={formData.workshop}
                onChange={handleChange}
              >
                <option value="">Seleccionar Taller</option>
                <option value="HUGO">HUGO</option>
                <option value="CHINO">CHINO</option>
                <option value="SOLTERO">SOLTERO</option>
                <option value="FREDY">FREDY</option>
                <option value="DANIEL">DANIEL</option>
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
              <label htmlFor="order_date" className="font-bold">
                Fecha
              </label>
              <input
                className="p-1 border h-9"
                type="date"
                name="order_date"
                placeholder="Fecha de corte"
                value={formData.order_date}
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
