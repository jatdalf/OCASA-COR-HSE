import React from "react";
import AccessButton from "../AccessButton/AccessButton";

const Consulta: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Consulta y participación</h1>
      <p>Espacio para consultas, sugerencias y participación de empleados.</p>
    <div style={{ margin: "55px" }}>
        <AccessButton address="https://docs.google.com/forms/d/e/1FAIpQLSeoMAcP1-ppxgFs9vaf7tmBB8o9pi8gAB1Ih2sRahpYwq-YEQ/viewform" />
      </div>
    </div>
  );
};

export default Consulta;
