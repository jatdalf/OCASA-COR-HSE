import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../../assets/OcasaLogoSmall.png";
import newsIcon from "../../assets/video.gif";
import calendarIcon from "../../assets/calendar.gif";
import reportIcon from "../../assets/report.gif";
import accidentIcon from "../../assets/accident.gif";
import riskIcon from "../../assets/risk.gif";
import environmentIcon from "../../assets/environment.gif";
import ideaIcon from "../../assets/idea.gif";
import heartIcon from "../../assets/heart.gif";
import hashtagIcon from "../../assets/hashtag.gif";
import React from "react";

const Home: React.FC = () => {
  return (
     <div className={styles.headerContainer}>      

      <div className={styles.titleContainer}>
        <div className={styles.logoTextRow}>
          <h1 className={styles.ocasaTitle}>OCASA</h1>
          <img
            src={logo}
            alt="OCASA Logo"
            className={styles.ocasaLogo}
          />
        </div>
      
       <div className={styles.subtitleContainer}>
          <div className={styles.turquoiseBar}></div>
          <div className={styles.subtitleText}>
            <p className={styles.subtitle}>Salud,</p>
            <p className={styles.subtitle}>Seguridad</p>
            <p className={styles.subtitle}>y Medioambiente</p>
          </div>
        </div>

      </div>

      {/* Grid de tarjetas */}
      <section className={styles.grid}>
        <Link to="/noticias" className={`${styles.card} ${styles.cardNoticias}`}>
          <div>
          <img src={hashtagIcon} alt="Hastag" className={styles.SmallIcon} />
          <img src={heartIcon} alt="Me gusta" className={styles.SmallIcon} />
          </div>
          <img src={newsIcon} alt="Noticias" className={styles.LargeIcon} />
          <p className={styles.cardText}>Noticias La Voz</p>
        </Link>

        <Link to="/capacitaciones" className={styles.card}>
          <img src={calendarIcon} alt="Capacitaciones" className={styles.icon} />
          <p className={styles.cardText}>Capacitaciones 2025</p>
        </Link>

        <Link to="/informe" className={styles.card}>
          <img src={reportIcon} alt="Informe" className={styles.icon} />
          <p className={styles.cardText}>Informe 2025</p>
        </Link>

        <Link to="/accidentes" className={styles.card}>
          <img src={accidentIcon} alt="Accidentes" className={styles.icon} />
          <p className={styles.cardText}>Accidentes/incidentes</p>
        </Link>

        <Link to="/riesgo" className={styles.card}>
          <img src={riskIcon} alt="Riesgo" className={styles.icon} />
          <p className={styles.cardText}>Evaluación de riesgo por puesto</p>
        </Link>

        <Link to="/ambientales" className={styles.card}>
          <img src={environmentIcon} alt="Impactos ambientales" className={styles.icon} />
          <p className={styles.cardText}>Aspectos e impactos ambientales</p>
        </Link>

        <Link to="/consulta" className={styles.card}>
          <img src={ideaIcon} alt="Consulta" className={styles.icon} />
          <p className={styles.cardText}>Consulta y participación</p>
        </Link>
      </section>
    </div>
  );
};

export default Home;
