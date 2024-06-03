import { useState, useEffect } from "react";
import EditShipping from "./EditShipping";
import { FaFilePdf } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import {
  PDFViewer,
  PDFDownloadLink,
  Page,
  Text,
  Image,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

export interface Shipping {
  id: string;
  shipping_order: number;
  name: string;
  zip: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  dni: string;
  transport: string;
  date: string;
  customer_note: string;
  completed: boolean;
  createdAt: string;
}

interface ProvinceNames {
  [key: string]: string;
}

export default function ShippingData() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState<boolean>(false);

  async function fetchData() {
    try {
      const res = await fetch("/api/shipping");
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

  const provinceNames: ProvinceNames = {
    A: "Salta",
    B: "Buenos Aires",
    C: "Ciudad Autónoma de Buenos Aires",
    D: "San Luis",
    E: "Entre Ríos",
    F: "La Rioja",
    G: "Santiago del Estero",
    H: "Chaco",
    J: "San Juan",
    K: "Catamarca",
    L: "La Pampa",
    M: "Mendoza",
    N: "Misiones",
    P: "Formosa",
    Q: "Neuquén",
    R: "Río Negro",
    S: "Santa Fe",
    T: "Tucumán",
    U: "Chubut",
    V: "Tierra del Fuego",
    W: "Corrientes",
    X: "Córdoba",
    Y: "Jujuy",
    Z: "Santa Cruz",
  };

  const getFullProvinceName = (initial: string) => {
    return provinceNames[initial] || initial;
  };

  const MyDoc = ({
    selectedShipping,
  }: {
    selectedShipping: Shipping | null;
  }) => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image src="/logo-bleemar.png" style={styles.logo} />
        <View style={styles.tableContainer}>
          {selectedShipping && (
            <>
              <View style={styles.table}>
                <View style={styles.tableRowHeader}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Enviar a:</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Dni:</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Teléfono:</Text>
                  </View>

                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Transporte:</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {selectedShipping.name}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{selectedShipping.dni}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {selectedShipping.phone}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {selectedShipping.transport}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.table}>
                <View style={styles.tableRowHeader}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Dirección:</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Localidad:</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>Provincia:</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellHeader}>CP:</Text>
                  </View>
                </View>

                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {selectedShipping.address}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {selectedShipping.city}
                    </Text>
                  </View>

                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {getFullProvinceName(selectedShipping.province)}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{selectedShipping.zip}</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    showPDF: {
      height: "95vh",
      width: "60vw",
    },
    button: {
      color: "#333333",
      fontSize: 16,
    },
    page: {
      backgroundColor: "#ffffff",
      padding: 10,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    logo: {
      height: 120,
      marginBottom: 20,
    },
    tableContainer: {
      width: "100%",
      margin: 20,
    },
    table: {
      display: "flex",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: "#bfbfbf",
    },
    tableRowHeader: {
      flexDirection: "row",
      backgroundColor: "#f3f3f3",
    },
    tableCol: {
      flex: 1,
      borderRightStyle: "solid",
      borderRightWidth: 1,
      borderRightColor: "#bfbfbf",
    },
    tableCellHeader: {
      padding: 10,
      fontSize: 16,
      fontWeight: "bold",
    },
    tableCell: {
      padding: 10,
      fontSize: 14,
    },
  });

  const closeEdition = () => {
    setEditMode(false);
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
    <>
      {!editMode ? (
        <div className="overflow-x-auto max-h-128">
          {showPDFPreview && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center">
              <button
                className="z-50 absolute bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded bottom-10"
                onClick={closePDFPreview}
              >
                Cerrar
              </button>
              <PDFViewer style={styles.showPDF}>
                <MyDoc selectedShipping={selectedShipping} />
              </PDFViewer>
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
                <th className="px-4 py-2 text-start">Estado</th>
                <th className="px-4 py-2 text-start">Acciones</th>
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
                    {ship.completed ? (
                      <span className="font-medium text-green-500">
                        Enviado
                      </span>
                    ) : (
                      <span className="font-medium text-yellow-500">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-3">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSelectedShipping(ship);
                      }}
                    >
                      <PiPencilSimpleLineFill size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setShowPDFPreview(true);
                        setSelectedShipping(ship);
                      }}
                    >
                      <FaFilePdf />
                    </button>
                    <PDFDownloadLink
                      document={<MyDoc selectedShipping={ship} />}
                      fileName={`Pedido-${ship.shipping_order}.pdf`}
                    >
                      <FaDownload />
                    </PDFDownloadLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EditShipping
          selectedShipping={selectedShipping}
          closeEdition={closeEdition}
        />
      )}
    </>
  );
}
