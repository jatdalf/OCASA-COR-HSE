import React from "react";
import AccessButton from "../AccessButton/AccessButton";

const Accidentes: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Accidentes / Incidentes</h1>
      <p>Registro y seguimiento de incidentes y accidentes.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/drive/folders/1tzixwGLg-sroKwzenR87iDkT9Kr-XIFA" />
      </div>
    </div>
  );
};

export default Accidentes;
