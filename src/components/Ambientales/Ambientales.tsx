import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy

const Ambientales: React.FC = () => {
  const { visits } = useGlobalCounters("Ambientales", SCRIPT_URL);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Aspectos e impactos ambientales</h1>
      <p>Información ambiental y gestión de impacto.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://docs.google.com/spreadsheets/d/1V5gqncd7HVsCx-sawhLuyRqgCJ26g9-y/edit?gid=1500150030#gid=1500150030" />
      </div>
       <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Ambientales;
