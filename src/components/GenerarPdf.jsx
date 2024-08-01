import { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, Text, StyleSheet, View, Image} from "@react-pdf/renderer";
import logo from '../assets/fibertel.png'

const styles = StyleSheet.create({
  page: {
    display: "flex",
    backgroundColor: "#fff",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginHorizontal: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 45,
    marginVertical: 15,
  }
});

const formatTime = (time) => {
  // Return the time in HH:mm format
  return time ? time.slice(0, 5) : "";
};

const GenerarPdf = ({ week }) => {
  const [riegos, setRiegos] = useState([]);

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/programaWeek/${week}/`);
        const data = response.data;
        setRiegos(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPrograma();
  }, [week]);

  // Agrupa los datos por idEsp32
  const groupedData = riegos.reduce((acc, riego) => {
    const dayOfWeek = new Date(riego.fecha).getDay();
    if (!acc[riego.idEsp32]) {
      acc[riego.idEsp32] = { idEsp32: riego.idEsp32, days: Array(7).fill(null) };
    }
    acc[riego.idEsp32].days[dayOfWeek - 1] = riego; // dayOfWeek - 1 because getDay() returns 0 for Sunday
    return acc;
  }, {});
  console.log("Esp32 agrupados");
  console.log(groupedData);

  const valves = Object.values(groupedData);
  console.log("Valvulas");  
  console.log(valves);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Image src={logo} style={styles.image} />
          <Text style={styles.title}>Programa de Riego - Semana {week}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "12.5%" }]}>
                <Text style={styles.tableCell}>Válvula</Text>
              </View>
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(day => (
                <View key={day} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{day}</Text>
                </View>
              ))}
            </View>
            {valves.map(valve => (
              <View style={styles.tableRow} key={`row-${valve.idEsp32}`}>
                <View style={[styles.tableCol, { width: "12.5%" }]}>
                  <Text style={styles.tableCell}>{valve.idEsp32}</Text>
                </View>
                {valve.days.map((riego, index) => (
                  <View key={`day-${index}`} style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {riego ? `${formatTime(riego.hora_inicio)} - ${formatTime(riego.hora_fin)}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenerarPdf;
