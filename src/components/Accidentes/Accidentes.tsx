import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy


const Accidentes: React.FC = () => {
  const { visits } = useGlobalCounters("Accidentes", SCRIPT_URL);


  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Accidentes / Incidentes</h1>
      <p>Registro y seguimiento de incidentes y accidentes.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/drive/folders/1tzixwGLg-sroKwzenR87iDkT9Kr-XIFA" />
      </div>
       <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Accidentes;
