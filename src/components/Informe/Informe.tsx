import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy

const Informe: React.FC = () => {
    const { visits } = useGlobalCounters("Informe", SCRIPT_URL);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Informe 2025</h1>
      <p>Visualización y descarga de reportes anuales.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://sites.google.com/ocasa.com/calidad-hse-corporativo/cali2023?authuser=0" />
      </div>
       <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
      
    </div>
  );
};

export default Informe;
