import {
  PDFViewer,
  Page,
  Image,
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
      backgroundColor: "#ffffff",
    },
    section: {
      margin: 10,
    },
    logo: {
      width: 120,
      margin: "0 auto",
    },
    table: {
      width: "auto",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCellHeader: {
      width: "50%",
      fontSize: 16,
      padding: 5,
      backgroundColor: "#f3f3f3",
      border: "1px solid #bfbfbf",
    },
    tableCell: {
      width: "50%",
      fontSize: 14,
      padding: 5,
      border: "1px solid #bfbfbf",
    },
  });

  const rolls = rollData || [];
  const rollcuts = rolls.map((roll) => roll.rollcuts).flat();
  const rolldetails = rolls.map((roll) => roll.rolldetails).flat();

  //Para calcular la cantidad de talles que hay y multiplicar ese valor por la cantidad de cortes
  const rollSizes = rolls.map((roll) => roll.size).join(",");
  const sizesArray = rollSizes.replace(/\s/g, "").split(",");
  const sizesCount = sizesArray.filter((size) => size !== "").length;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50">
      <div className="max-w-4xl mx-auto mt-5 h-[95vh] overflow-auto relative">
        <PDFViewer width="100%" height="100%">
          <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
              <Image src="/logo-bleemar.png" style={styles.logo} />
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
                    <Text style={styles.tableCell}>
                      {cut.quantity * sizesCount}
                    </Text>
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
      </div>
      <button
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onClick={closePDFPreview}
      >
        Cerrar
      </button>
    </div>
  );
}
