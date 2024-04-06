import { useState, FormEvent, ChangeEvent } from "react";
import Modal from "react-modal";
import { FaRegTrashAlt } from "react-icons/fa";

export default function AddOrder() {
  const [formData, setFormData] = useState({
    title: "",
    gender: "",
    total_quantity: 0,
    order_date: "",
    size: "",
    cuts: [] as {
      color: string;
      combined: string;
      lining: string;
      quantity: string;
    }[],
    details: [] as {
      nombre: string;
      cantidad: string;
    }[],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const parsedValue = name === "total_quantity" ? parseInt(value, 10) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleCutChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const updatedCuts = [...formData.cuts];
    updatedCuts[index] = { ...updatedCuts[index], [name]: value };
    setFormData({ ...formData, cuts: updatedCuts });
  };

  const handleDetailChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const updatedDetails = [...formData.details];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };
    setFormData({ ...formData, details: updatedDetails });
  };

  const handleAddCut = (): void => {
    setFormData({
      ...formData,
      cuts: [
        ...formData.cuts,
        { color: "", combined: "", lining: "", quantity: "" },
      ],
    });
  };

  const handleRemoveCut = (index: number): void => {
    const updatedCuts = [...formData.cuts];
    updatedCuts.splice(index, 1);
    setFormData({ ...formData, cuts: updatedCuts });
  };

  const handleAddDetail = (): void => {
    setFormData({
      ...formData,
      details: [...formData.details, { nombre: "", cantidad: "" }],
    });
  };

  const handleRemoveDetail = (index: number): void => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData({ ...formData, details: updatedDetails });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("/api/prendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Pedido agregado");
        setFormData({
          title: "",
          gender: "",
          total_quantity: 0,
          order_date: "",
          size: "",
          cuts: [],
          details: [],
        });
        setModalIsOpen(false);
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
        Agregar pedido
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        contentLabel="Agregar Pedido"
        style={{
          content: {
            maxHeight: "70vh",
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
              <label htmlFor="title">Nombre</label>
              <input
                className="p-1 border h-9"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender">Género</label>
              <input
                className="p-1 border h-9"
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="size">Talles</label>
              <input
                className="p-1 border h-9"
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="total_quantity">Cantidad</label>
              <input
                className="p-1 border h-9"
                type="number"
                name="total_quantity"
                value={formData.total_quantity}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="order_date">Fecha del pedido</label>
              <input
                className="p-1 border h-9"
                type="date"
                name="order_date"
                value={formData.order_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cortes */}
          {formData.cuts.map((cut, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col w-full">
                <label htmlFor={`color-${index}`}>Color</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="color"
                  value={cut.color}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`combined-${index}`}>Combinado</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="combined"
                  value={cut.combined}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`lining-${index}`}>Forro</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="lining"
                  value={cut.lining}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`quantity-${index}`}>Cantidad</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="quantity"
                  value={cut.quantity}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCut(index)}
                className="py-1 px-2 h-9 mt-auto"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCut}
            className="font-bold px-4 py-2 mr-auto"
          >
            + Agregar corte
          </button>

          {/* Cortes */}

          {/* Detalles */}

          {formData.details.map((detail, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col w-full">
                <label htmlFor={`nombre-${index}`}>Nombre</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="nombre"
                  value={detail.nombre}
                  onChange={(e) => handleDetailChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`cantidad-${index}`}>Cantidad</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="cantidad"
                  value={detail.cantidad}
                  onChange={(e) => handleDetailChange(e, index)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDetail(index)}
                className="py-1 px-2 h-9 mt-auto"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddDetail}
            className="font-bold px-4 py-2 mr-auto"
          >
            + Agregar detalle
          </button>

          {/* Detalles */}

          <div className="flex gap-2 ml-auto">
            <button
              type="submit"
              className="bg-green-s text-white font-bold px-4 py-2 rounded"
            >
              Agregar pedido
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
