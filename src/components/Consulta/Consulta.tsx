import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy

const Consulta: React.FC = () => {
    const { visits } = useGlobalCounters("Consulta", SCRIPT_URL);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Consulta y participación</h1>
      <p>Espacio para consultas, sugerencias y participación de empleados.</p>
    <div style={{ margin: "55px" }}>
        <AccessButton address="https://docs.google.com/forms/d/e/1FAIpQLSeoMAcP1-ppxgFs9vaf7tmBB8o9pi8gAB1Ih2sRahpYwq-YEQ/viewform" />
    </div>
     <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Consulta;
