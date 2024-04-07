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
    workshop: "",
    garmentcuts: [] as {
      color: string;
      combined: string;
      lining: string;
      quantity: 0;
    }[],
    details: [] as {
      title: string;
      quantity: 0;
    }[],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOrderChange = (
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

  const handleCutChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseInt(value, 10) : value;
    const updatedCuts = [...formData.garmentcuts];
    updatedCuts[index] = { ...updatedCuts[index], [name]: parsedValue };
    setFormData({ ...formData, garmentcuts: updatedCuts });
  };

  const handleAddCut = (): void => {
    setFormData({
      ...formData,
      garmentcuts: [
        ...formData.garmentcuts,
        { color: "", combined: "", lining: "", quantity: 0 },
      ],
    });
  };

  const handleRemoveCut = (index: number): void => {
    const updatedCuts = [...formData.garmentcuts];
    updatedCuts.splice(index, 1);
    setFormData({ ...formData, garmentcuts: updatedCuts });
  };

  const handleDetailChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseInt(value, 10) : value;
    const updatedDetails = [...formData.details];
    updatedDetails[index] = { ...updatedDetails[index], [name]: parsedValue };
    setFormData({ ...formData, details: updatedDetails });
  };

  const handleAddDetail = (): void => {
    setFormData({
      ...formData,
      details: [...formData.details, { title: "", quantity: 0 }],
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
      if (response.status === 422) {
        alert("Rellena todos los campos");
        return;
      }
      if (response.ok) {
        alert("Pedido agregado");
        setFormData({
          title: "",
          gender: "",
          total_quantity: 0,
          order_date: "",
          size: "",
          workshop: "",
          garmentcuts: [],
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
            maxWidth: "70vw",
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
                onChange={handleOrderChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender">Género</label>
              <input
                className="p-1 border h-9"
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleOrderChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="size">Talles</label>
              <select
                className="p-1 border h-9"
                name="size"
                value={formData.size}
                onChange={handleOrderChange}
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
              <label htmlFor="workshop">Taller</label>
              <input
                className="p-1 border h-9"
                type="text"
                name="workshop"
                value={formData.workshop}
                onChange={handleOrderChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="total_quantity">Cantidad</label>
              <input
                className="p-1 border h-9"
                type="number"
                name="total_quantity"
                value={formData.total_quantity}
                onChange={handleOrderChange}
                min={1}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="order_date">Fecha del pedido</label>
              <input
                className="p-1 border h-9"
                type="date"
                name="order_date"
                value={formData.order_date}
                onChange={handleOrderChange}
              />
            </div>
          </div>

          {/* Cortes */}
          {formData.garmentcuts.map((garmentcuts, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col">
                <label htmlFor={`color-${index}`}>Color</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="color"
                  value={garmentcuts.color}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`combined-${index}`}>Combinado</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="combined"
                  value={garmentcuts.combined}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`lining-${index}`}>Forro</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="lining"
                  value={garmentcuts.lining}
                  onChange={(e) => handleCutChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`quantity-${index}`}>Cantidad</label>
                <input
                  className="p-1 border h-9"
                  type="number"
                  name="quantity"
                  value={garmentcuts.quantity}
                  onChange={(e) => handleCutChange(e, index)}
                  min={1}
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
                <label htmlFor={`title-${index}`}>Detalle</label>
                <input
                  className="p-1 border h-9"
                  type="text"
                  name="title"
                  value={detail.title}
                  onChange={(e) => handleDetailChange(e, index)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`quantity-${index}`}>Cantidad</label>
                <input
                  className="p-1 border h-9"
                  type="number"
                  name="quantity"
                  value={detail.quantity}
                  onChange={(e) => handleDetailChange(e, index)}
                  min={1}
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
