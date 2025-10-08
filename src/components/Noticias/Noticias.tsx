import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy

const Noticias: React.FC = () => {
    const { visits } = useGlobalCounters("Noticias", SCRIPT_URL);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Noticias La Voz</h1>
      <p>Sección para mostrar noticias y actualizaciones.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/file/d/1VFR0M7g2qHnf4gG21wk_DmMGXK_8pO2X/view" />
      </div>
       <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Noticias;
