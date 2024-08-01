import GenerarPdf from "./components/GenerarPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState } from "react";

function App() {

  const [week, setWeek] = useState(1); 

  const handleWeekChange = (event) => {
    setWeek(event.target.value); // Actualiza el estado con el valor actual del input
  };

  console.log(week);

  return (
    <>
      <input type="text" value={week} onChange={handleWeekChange}/>
      <PDFDownloadLink document={<GenerarPdf week={week}/>} fileName="somename.pdf">
        {({ loading }) =>
          loading ? <button> Loading </button> : <button>Download PDF</button>
        }
      </PDFDownloadLink>
    </>
  );
}

export default App;
