import React from "react";
import AccessButton from "../AccessButton/AccessButton";

const Informe: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Informe 2025</h1>
      <p>Visualización y descarga de reportes anuales.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://sites.google.com/ocasa.com/calidad-hse-corporativo/cali2023?authuser=0" />
      </div>
      
    </div>
  );
};

export default Informe;
