import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy

const Riesgo: React.FC = () => {
    const { visits } = useGlobalCounters("Riesgo", SCRIPT_URL);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Evaluación de riesgo por puesto</h1>
      <p>Herramientas y documentación para análisis de riesgo.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/drive/folders/1HtQJZHlsNG1qf-5TXr2gqFkO5C_yhtrq" />
      </div>
       <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Riesgo;
