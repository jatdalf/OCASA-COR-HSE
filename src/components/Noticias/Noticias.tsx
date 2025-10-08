import React from "react";
import AccessButton from "../AccessButton/AccessButton";

const Noticias: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Noticias La Voz</h1>
      <p>Sección para mostrar noticias y actualizaciones.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://drive.google.com/file/d/1VFR0M7g2qHnf4gG21wk_DmMGXK_8pO2X/view" />
      </div>
    </div>
  );
};

export default Noticias;
