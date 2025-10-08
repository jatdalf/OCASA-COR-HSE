import React from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy

const Capacitaciones: React.FC = () => {
  const { visits } = useGlobalCounters("Capacitaciones", SCRIPT_URL);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Capacitaciones 2025</h1>
      <p>Lista de cursos, entrenamientos y materiales de formación.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/drive/folders/1I7gwfOHFFJVyzVR4Qrl_VOeqorIf1y9_" />
      </div>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>

    </div>
  );
};

export default Capacitaciones;
