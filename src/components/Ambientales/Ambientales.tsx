import React from "react";
import AccessButton from "../AccessButton/AccessButton";

const Ambientales: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Aspectos e impactos ambientales</h1>
      <p>Información ambiental y gestión de impacto.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address="https://docs.google.com/spreadsheets/d/1V5gqncd7HVsCx-sawhLuyRqgCJ26g9-y/edit?gid=1500150030#gid=1500150030" />
      </div>
    </div>
  );
};

export default Ambientales;
