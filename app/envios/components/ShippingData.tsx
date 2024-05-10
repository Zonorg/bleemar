import { useState, useEffect } from "react";
import PDFShipping from "./PDFShipping";
import { FaFilePdf } from "react-icons/fa6";

interface Shipping {
  id: string;
  shipping_order: number;
  name: string;
  zip: string;
  address: string;
  city: string;
  province: string;
  dni: string;
  transport: string;
  date: string;
  customer_note: string;
  createdAt: string;
}

export default function ShippingData() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(
    null
  );
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);

  async function fetchData() {
    try {
      const secretKey = "Ts~`hs1d>/<TnsXMuplitR(+~`C5,xt~9$X9mY9jPx~%tGaO/o";
      const res = await fetch("/api/shipping", {
        headers: {
          authorization: `Bearer ${secretKey}`,
        },
      });
      if (res.ok) {
        const shipping = await res.json();
        setShipping(shipping);
      } else {
        console.error("Error fetching shipping data:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching shipping data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const closePDFPreview = () => {
    setShowPDFPreview(false);
    setSelectedShipping(null);
  };

  const formattedSearchTerm = searchTerm.toLowerCase();

  const filteredData = shipping.filter(
    (ship) =>
      ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.shipping_order.toString().includes(searchTerm.toLowerCase()) ||
      ship.zip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(ship.date)
        .toLocaleString("es-ES")
        .toLowerCase()
        .includes(formattedSearchTerm)
  );

  return (
    <div className="overflow-x-auto max-h-128">
      {showPDFPreview && selectedShipping && (
        <div>
          <PDFShipping
            shippData={selectedShipping}
            closePDFPreview={closePDFPreview}
          />
        </div>
      )}
      <input
        type="text"
        placeholder="Buscar pedido..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full m-auto px-4 py-2 border rounded-md mb-4"
      />
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-start">Nº Pedido</th>
            <th className="px-4 py-2 text-start">Cliente</th>
            <th className="px-4 py-2 text-start">CP</th>
            <th className="px-4 py-2 text-start">Fecha</th>
            <th className="px-4 py-2 text-start">Descargar</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {filteredData.map((ship) => (
            <tr key={ship.id} className="border-b">
              <td className="px-4 py-2">{ship.shipping_order}</td>
              <td className="px-4 py-2">{ship.name}</td>
              <td className="px-4 py-2">{ship.zip}</td>
              <td className="px-4 py-2">
                {new Date(ship.date).toLocaleDateString("es-ES")}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedShipping(ship);
                    setShowPDFPreview(true);
                  }}
                >
                  <FaFilePdf />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
