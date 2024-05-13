import { useState, FormEvent, ChangeEvent, useRef } from "react";
import Modal from "react-modal";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { RiDeleteBackFill } from "react-icons/ri";

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

  const [sizeCount, setSizeCount] = useState<Record<string, number>>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0,
  });

  const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    order_number: 0,
    size: [],
    workshop: "",
    total_quantity: 0,
    order_date: getCurrentDate(),
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

    // Calcular la suma total de las cantidades
    const totalQuantity = updatedCuts.reduce(
      (sum, cut) => sum + (cut.quantity || 0),
      0
    );

    // Multiplicar la cantidad total por la cantidad de talles seleccionados
    const totalQuantityWithSizes = totalQuantity * formData.size.length;

    setFormData({
      ...formData,
      rollcuts: updatedCuts,
      total_quantity: totalQuantityWithSizes,
    });
  };

  const handleCutChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseInt(value, 10) : value;
    const updatedCuts = [...formData.rollcuts];
    updatedCuts[index] = { ...updatedCuts[index], [name]: parsedValue };

    // Calcular la suma total de las cantidades
    const totalQuantity = updatedCuts.reduce(
      (sum, cut) => sum + (cut.quantity || 0),
      0
    );

    // Multiplicar la cantidad total por la cantidad de talles seleccionados
    const totalQuantityWithSizes = totalQuantity * formData.size.length;

    setFormData({
      ...formData,
      rollcuts: updatedCuts,
      total_quantity: totalQuantityWithSizes,
    });
  };

  const handleIncrement = (size: keyof typeof sizeCount) => {
    setSizeCount((prevState) => ({
      ...prevState,
      [size]: prevState[size] + 1,
    }));

    handleSizeChange({
      target: {
        name: size,
        checked: true,
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleDecrement = (size: keyof typeof sizeCount) => {
    if (sizeCount[size] > 0) {
      setSizeCount((prevState) => ({
        ...prevState,
        [size]: prevState[size] - 1, // Decrementar el contador del tamaño en 1
      }));

      setFormData((prevState) => {
        const newSize = [...prevState.size]; // Crear una copia de la lista de tamaños seleccionados
        const sizeIndex = newSize.indexOf(size); // Encontrar el índice del tamaño en la lista

        if (sizeIndex !== -1) {
          newSize.splice(sizeIndex, 1); // Eliminar una instancia del tamaño del array
        }

        // Recalcular la cantidad total con los tamaños seleccionados
        const totalQuantity = prevState.rollcuts.reduce(
          (sum, cut) => sum + (cut.quantity || 0),
          0
        );
        const totalQuantityWithSizes = totalQuantity * newSize.length;

        return {
          ...prevState,
          size: newSize,
          total_quantity: totalQuantityWithSizes,
        };
      });
    }
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      let newSize;
      if (checked) {
        newSize = [...prevState.size, name];
      } else {
        newSize = prevState.size.filter((size) => size !== name);
      }

      // Calcular la suma total de las cantidades
      const totalQuantity = prevState.rollcuts.reduce(
        (sum, cut) => sum + (cut.quantity || 0),
        0
      );

      // Multiplicar la cantidad total por la cantidad de talles seleccionados
      const totalQuantityWithSizes = totalQuantity * newSize.length;

      return {
        ...prevState,
        size: newSize,
        total_quantity: totalQuantityWithSizes,
      };
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
          order_date: getCurrentDate(),
          rollcuts: [],
          rolldetails: [],
        });
        window.location.reload();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleClose = () => {
    setModalIsOpen(false);
    setFormData({
      name: "",
      order_number: 0,
      size: [],
      workshop: "",
      total_quantity: 0,
      order_date: getCurrentDate(),
      rollcuts: [
        { color: "", combined: "", lining: "", quantity: 0 },
        { color: "", combined: "", lining: "", quantity: 0 },
        { color: "", combined: "", lining: "", quantity: 0 },
        { color: "", combined: "", lining: "", quantity: 0 },
        { color: "", combined: "", lining: "", quantity: 0 },
      ],
      rolldetails: [
        { title: "", quantity: 0 },
        { title: "", quantity: 0 },
      ],
    });
  };

  return (
    <div>
      <button onClick={() => setModalIsOpen(true)} className="green_button">
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
            overflow: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex justify-between">
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
                <option value="MATEO">MATEO</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="total_quantity" className="font-bold">
                Cantidad total
              </label>
              <input
                className="p-1 border h-9"
                type="number"
                name="total_quantity"
                readOnly
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
          <div className="border rounded p-2">
            <label className="font-bold block">Talles:</label>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                <div className="flex items-center" key={size}>
                  {/* <input
                    type="checkbox"
                    name={size}
                    checked={formData.size.includes(size)}
                    onChange={handleSizeChange}
                    className="mr-1"
                  /> */}
                  <label htmlFor={size} className="mr-1 font-bold">
                    {size}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleIncrement(size as keyof typeof sizeCount)
                    }
                    className="px-2 py-1 hover:scale-110"
                  >
                    <FaPlus />
                  </button>
                  <p className="ml-1 text-xs">CANTIDAD:</p>
                  <p className="ml-1 font-bold">{sizeCount[size]}</p>
                  {sizeCount[size] > 0 && ( // Condición para mostrar el botón de trash
                    <button
                      type="button"
                      onClick={() =>
                        handleDecrement(size as keyof typeof sizeCount)
                      }
                      className="px-2 py-1 text-red-500 hover:scale-110"
                    >
                      <RiDeleteBackFill size={20} />
                    </button>
                  )}
                </div>
              ))}
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
              onClick={handleClose}
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
