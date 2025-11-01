import React, { useEffect, useState } from "react";
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
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter";

type LinkItem = { key: string; texto?: string; url?: string };

const DEFAULT_LINKS: LinkItem[] = [
  { key: "Tarjeta1", texto: "Capacitaciones 2025", url: "" },
  { key: "Tarjeta2", texto: "Informe 2025", url: "" },
  { key: "Tarjeta3", texto: "Accidentes/incidentes", url: "" },
  { key: "Tarjeta4", texto: "Noticias La Voz", url: "" },
  { key: "Tarjeta5", texto: "Evaluación de riesgo por puesto", url: "" },
  { key: "Tarjeta6", texto: "Aspectos e impactos ambientales", url: "" },
  { key: "Tarjeta7", texto: "Consulta y participación", url: "" },
];

const Home: React.FC = () => {
  const { visits } = useGlobalCounters("Home", SCRIPT_URL);
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);

  useEffect(() => {
    const load = async () => {
      // 1) mostrar cache local inmediatamente si existe
      try {
        const cache = localStorage.getItem("admin_links");
        if (cache) {
          const parsed = JSON.parse(cache);
          if (Array.isArray(parsed) && parsed.length) {
            setLinks(parsed);
          }
        }
      } catch (e) {
        console.warn("No se pudo leer admin_links desde localStorage", e);
      }

      // 2) luego intentar traer del servidor y sobreescribir si hay respuesta válida
      try {
        const res = await fetch("/api/adminLinks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resource: "links", action: "read" }),
        });
        const json = await res.json();
        const items: LinkItem[] = (json.links || []).map((l: any, i: number) => ({
          key: l.key ?? `Tarjeta${i + 1}`,
          texto: l.texto ?? l.key ?? `Tarjeta ${i + 1}`,
          url: l.url ?? "",
        }));
        if (items.length) {
          const merged = DEFAULT_LINKS.map((d, i) => {
            const found = items.find(it => (it.key || "").toLowerCase() === d.key.toLowerCase());
            return found ?? items[i] ?? d;
          });
          setLinks(merged);
          // actualizar cache local con lo del servidor (opcional)
          try { localStorage.setItem("admin_links", JSON.stringify(merged)); } catch {}
        }
      } catch (err) {
        console.error("Error loading admin links:", err);
        // ya mostramos cache o defaults
      }
    };
    load();
  }, []);

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
      
       

      </div>

      {/* Grid de tarjetas */}
      <section className={styles.grid}>

        <div className={styles.introBlock}>
            <div className={styles.turquoiseBar}></div>
            <div className={styles.subtitleText}>
                <p className={styles.subtitle}>Salud,</p>
                <p className={styles.subtitle}>Seguridad</p>
                <p className={styles.subtitle}>y Medioambiente</p>
            </div>
        </div>
        
        <Link to="/capacitaciones" className={styles.card}>
          <img src={calendarIcon} alt="Capacitaciones" className={styles.icon} />
          <p className={styles.cardText}>{links[0]?.texto}</p>
        </Link>

        <Link to="/informe" className={styles.card}>
          <img src={reportIcon} alt="Informe" className={styles.icon} />
          <p className={styles.cardText}>{links[1]?.texto}</p>
        </Link>

        <Link to="/accidentes" className={styles.card}>
          <img src={accidentIcon} alt="Accidentes" className={styles.icon} />
          <p className={styles.cardText}>{links[2]?.texto}</p>
        </Link>

        <Link to="/noticias" className={`${styles.card} ${styles.cardNoticias}`}>
          <div>
          <img src={hashtagIcon} alt="Hastag" className={styles.SmallIcon} />
          <img src={heartIcon} alt="Me gusta" className={styles.SmallIcon2} />
          </div>
          <img src={newsIcon} alt="Noticias" className={styles.LargeIcon} />
          <p className={styles.cardText}>{links[3]?.texto}</p>
        </Link>

        <Link to="/riesgo" className={styles.card}>
          <img src={riskIcon} alt="Riesgo" className={styles.icon} />
          <p className={styles.cardText}>{links[4]?.texto}o</p>
        </Link>

        <Link to="/ambientales" className={styles.card}>
          <img src={environmentIcon} alt="Impactos ambientales" className={styles.icon} />
          <p className={styles.cardText}>{links[5]?.texto}</p>
        </Link>

        <Link to="/consulta" className={styles.card}>
          <img src={ideaIcon} alt="Consulta" className={styles.icon} />
          <p className={styles.cardText}>{links[6]?.texto}</p>
        </Link>
      </section>

      <div className={styles.footer}>
        <p className={styles.footerText}>© 2025 OCASA. Todos los derechos reservados. (Version: 1.1)</p>  
        <p className={styles.footerText}>Desarrollado por Jorge Toso</p>
        <Link to="/visitas" className={styles.footerLink}>
        <p className={styles.footerText}>Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong></p>
        </Link>      
        
      </div>  

    </div>
  );
};

export default Home;
