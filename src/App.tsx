import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Capacitaciones from "./components/Capacitaciones/Capacitaciones";
import Informe from "./components/Informe/Informe";
import Accidentes from "./components/Accidentes/Accidentes";
import Noticias from "./components/Noticias/Noticias";
import Riesgo from "./components/Riesgo/Riesgo";
import Ambientales from "./components/Ambientales/Ambientales";
import Consulta from "./components/Consulta/Consulta";
import Visitas from "./components/Visitas/Visitas";
import Admin from "./components/Admin/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capacitaciones" element={<Capacitaciones />} />
        <Route path="/informe" element={<Informe />} />
        <Route path="/accidentes" element={<Accidentes />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/riesgo" element={<Riesgo />} />
        <Route path="/ambientales" element={<Ambientales />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/visitas" element={<Visitas />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
export default App;

