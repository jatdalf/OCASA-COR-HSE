import React from "react";
import AccessButton from "../AccessButton/AccessButton";

const Riesgo: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Evaluación de riesgo por puesto</h1>
      <p>Herramientas y documentación para análisis de riesgo.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/drive/folders/1HtQJZHlsNG1qf-5TXr2gqFkO5C_yhtrq" />
      </div>
    </div>
  );
};

export default Riesgo;
