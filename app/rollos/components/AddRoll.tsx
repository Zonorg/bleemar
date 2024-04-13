import { useState, FormEvent, ChangeEvent } from "react";
import Modal from "react-modal";
import { FaRegTrashAlt } from "react-icons/fa";

type FormData = {
  name: string;
  order_number: number;
  size: string[];
  workshop: string;
  total_quantity: number;
  order_date: string;
  rollcuts: {
    color: string;
    combined: string;
    lining: string;
    quantity: number;
  }[];
  rolldetails: {
    title: string;
    quantity: number;
  }[];
};

export default function AddRoll() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    order_number: 0,
    size: [],
    workshop: "",
    total_quantity: 0,
    order_date: "",
    rollcuts: [
      { color: "", combined: "", lining: "", quantity: 0 },
      { color: "", combined: "", lining: "", quantity: 0 },
      { color: "", combined: "", lining: "", quantity: 0 },
      { color: "", combined: "", lining: "", quantity: 0 },
      { color: "", combined: "", lining: "", quantity: 0 },
    ],
    rolldetails: [
      {
        title: "",
        quantity: 0,
      },
      {
        title: "",
        quantity: 0,
      },
      {
        title: "",
        quantity: 0,
      },
    ],
  });

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

  const handleAddCut = (): void => {
    setFormData({
      ...formData,
      rollcuts: [
        ...formData.rollcuts,
        { color: "", combined: "", lining: "", quantity: 0 },
      ],
    });
  };

  const handleRemoveCut = (index: number): void => {
    const updatedCuts = [...formData.rollcuts];
    updatedCuts.splice(index, 1);
    setFormData({ ...formData, rollcuts: updatedCuts });
  };

  const handleCutChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseInt(value, 10) : value;
    const updatedCuts = [...formData.rollcuts];
    updatedCuts[index] = { ...updatedCuts[index], [name]: parsedValue };
    setFormData({ ...formData, rollcuts: updatedCuts });
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      if (checked) {
        // Si el checkbox está marcado, añade el talle al array de size.
        return { ...prevState, size: [...prevState.size, name] };
      } else {
        // Si el checkbox no está marcado, remueve el talle del array de size.
        return {
          ...prevState,
          size: prevState.size.filter((size) => size !== name),
        };
      }
    });
  };

  const handleDetailChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseInt(value, 10) : value;
    const updatedDetails = [...formData.rolldetails];
    updatedDetails[index] = { ...updatedDetails[index], [name]: parsedValue };
    setFormData({ ...formData, rolldetails: updatedDetails });
  };

  const handleAddDetail = (): void => {
    setFormData({
      ...formData,
      rolldetails: [...formData.rolldetails, { title: "", quantity: 0 }],
    });
  };

  const handleRemoveDetail = (index: number): void => {
    const updatedDetails = [...formData.rolldetails];
    updatedDetails.splice(index, 1);
    setFormData({ ...formData, rolldetails: updatedDetails });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rollos", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (response.status === 422) {
        alert("Rellena todos los campos");
        return;
      }
      if (response.ok) {
        alert("Rollo agregado ");
        setFormData({
          name: "",
          order_number: 0,
          size: [],
          workshop: "",
          total_quantity: 0,
          order_date: "",
          rollcuts: [],
          rolldetails: [],
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
        Agregar pedido
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        contentLabel="Agregar pedido"
        style={{
          content: {
            margin: "auto",
            maxHeight: "80vh",
            overflow: "auto",
          },
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex justify-between">
            {/* <div className="flex flex-col">
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
            </div> */}
            <div className="flex flex-col">
              <label htmlFor="name" className="font-bold">
                Nombre del pedido
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
                placeholder="Fecha de pedido"
                value={formData.order_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cortes */}
          {formData.rollcuts.map((cut, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex flex-col">
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
                  type="number"
                  name="quantity"
                  value={cut.quantity}
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
          {formData.rolldetails.map((detail, index) => (
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

          {/* Talles */}
          <div className="flex gap-3 items-center justify-center border rounded p-2">
            <label className="font-bold">Talles</label>
            <div className="flex flex-col">
              <input
                type="checkbox"
                name="XS"
                checked={formData.size.includes("XS")}
                onChange={handleSizeChange}
              />
              <label htmlFor="size_XS">XS</label>
            </div>
            <div className="flex flex-col">
              <input
                type="checkbox"
                name="S"
                checked={formData.size.includes("S")}
                onChange={handleSizeChange}
              />
              <label htmlFor="size_S">S</label>
            </div>
            <div className="flex flex-col">
              <input
                type="checkbox"
                name="M"
                checked={formData.size.includes("M")}
                onChange={handleSizeChange}
              />
              <label htmlFor="size_M">M</label>
            </div>
            <div className="flex flex-col">
              <input
                type="checkbox"
                name="L"
                checked={formData.size.includes("L")}
                onChange={handleSizeChange}
              />
              <label htmlFor="size_L">L</label>
            </div>
            <div className="flex flex-col">
              <input
                type="checkbox"
                name="XL"
                checked={formData.size.includes("XL")}
                onChange={handleSizeChange}
              />
              <label htmlFor="size_XL">XL</label>
            </div>
            <div className="flex flex-col">
              <input
                type="checkbox"
                name="XXL"
                checked={formData.size.includes("XXL")}
                onChange={handleSizeChange}
              />
              <label htmlFor="size_XXL">XXL</label>
            </div>
          </div>
          {/* Talles */}

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
