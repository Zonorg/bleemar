import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

interface RollData {
  order_number: number;
  name: string;
  workshop: string;
  size: string;
  total_quantity: number;
  order_date: string;
  rollcuts: {
    color: string;
    combined: string;
    lining: string;
    quantity: number;
  }[];
  rolldetails: { title: string; quantity: number }[];
}

interface Props {
  rollData: RollData[];
  addOneDay: (dateString: string) => string;
  closePDFPreview: () => void;
}

export default function PDFPreview({
  rollData,
  addOneDay,
  closePDFPreview,
}: Props) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#f7f7f7",
    },
    section: {
      margin: 10,
      padding: 10,
    },
    documentTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333333",
      margin: "2px auto",
    },
    table: {
      width: "auto",
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: "row",
      fontSize: 12,
      color: "#333333",
    },
    tableCellHeader: {
      width: "50%",
      border: "1px solid black",
      padding: 5,
      color: "#ffffff",
      backgroundColor: "#09c184",
    },
    tableCell: {
      width: "50%",
      padding: 5,
      border: "1px solid black",
    },
  });

  const rolls = rollData || [];
  const rollcuts = rolls.map((roll) => roll.rollcuts).flat();
  const rolldetails = rolls.map((roll) => roll.rolldetails).flat();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50">
      <div className="max-w-4xl mx-auto mt-5 h-[95vh] overflow-auto relative">
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size="A4" style={styles.page}>
              <Text style={styles.documentTitle}>BleeMar</Text>
              <View style={styles.section}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellHeader}>Nº PEDIDO</Text>
                  <Text style={styles.tableCellHeader}>NOMBRE</Text>
                  <Text style={styles.tableCellHeader}>TALLER</Text>
                  <Text style={styles.tableCellHeader}>FECHA</Text>
                </View>
                {rolls.map((roll, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{roll.order_number}</Text>
                    <Text style={styles.tableCell}>{roll.name}</Text>
                    <Text style={styles.tableCell}>{roll.workshop}</Text>
                    <Text style={styles.tableCell}>
                      {addOneDay(roll.order_date)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.section}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellHeader}>COLORES</Text>
                  <Text style={styles.tableCellHeader}>COMBINADO</Text>
                  <Text style={styles.tableCellHeader}>FORRO</Text>
                  <Text style={styles.tableCellHeader}>CANTIDAD</Text>
                </View>
                {rollcuts.map((cut, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{cut.color}</Text>
                    <Text style={styles.tableCell}>{cut.combined}</Text>
                    <Text style={styles.tableCell}>{cut.lining}</Text>
                    <Text style={styles.tableCell}>{cut.quantity}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.section}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellHeader}>DETALLES</Text>
                  <Text style={styles.tableCellHeader}>CANTIDAD</Text>
                </View>
                {rolldetails.map((detail, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{detail.title}</Text>
                    <Text style={styles.tableCell}>{detail.quantity}</Text>
                  </View>
                ))}
              </View>
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
