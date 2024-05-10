import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

interface ShipData {
  id: string;
  name: string;
  zip: string;
  address: string;
  city: string;
  province: string;
  dni: string;
}

interface Props {
  shippData: ShipData;
  closePDFPreview: () => void;
}

interface ProvinceNames {
  [key: string]: string;
}

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

export default function PDFShipping({ shippData, closePDFPreview }: Props) {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      padding: 10,
    },
    documentTitle: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#333333",
      padding: 5,
      textAlign: "center",
    },
    documentSubtitle: {
      fontSize: 20,
      padding: 5,
      color: "#ffffff",
      backgroundColor: "#333333",
    },
    tableRow: {
      flexDirection: "column",
      fontSize: 16,
      color: "#333333",
      marginBottom: 10,
      margin: "50px auto",
      minWidth: "300px",
    },
    tableCell: {
      padding: 5,
      borderBottom: "1px dotted black",
    },
  });

  const data = shippData ? [shippData] : [];

  const getFullProvinceName = (initial: string) => {
    return provinceNames[initial] || initial;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50">
      <div className="max-w-4xl mx-auto mt-5 h-[95vh] overflow-auto relative">
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.documentTitle}>BleeMar</Text>
              {data.map((shipping) => (
                <View key={shipping.id} style={styles.tableRow}>
                  <Text style={styles.documentSubtitle}>Enviar a:</Text>
                  <Text style={styles.tableCell}>{shipping.name}</Text>
                  <Text style={styles.tableCell}>Dni: {shipping.dni}</Text>
                  <Text style={styles.tableCell}>
                    Dirección: {shipping.address}
                  </Text>
                  <Text style={styles.tableCell}>Ciudad: {shipping.city}</Text>
                  <Text style={styles.tableCell}>
                    Provincia: {getFullProvinceName(shipping.province)}
                  </Text>
                  <Text style={styles.tableCell}>CP: {shipping.zip}</Text>
                </View>
              ))}
            </Page>
          </Document>
        </PDFViewer>
        <button
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={closePDFPreview}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
