import React, { useEffect, useState } from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter";
const LOCAL_KEY = "admin_links";

interface LinkItem {
  key: string;
  texto?: string;
  url?: string;
}

const DEFAULT_TITLE = "Consulta y participación";
const DEFAULT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeoMAcP1-ppxgFs9vaf7tmBB8o9pi8gAB1Ih2sRahpYwq-YEQ/viewform";

const Consulta: React.FC = () => {
  const { visits } = useGlobalCounters("Consulta", SCRIPT_URL);

  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [address, setAddress] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const loadLinks = async () => {
      // 1) leer cache local (para ver cambios inmediatamente)
      try {
        const cache = localStorage.getItem(LOCAL_KEY);
        if (cache) {
          const parsed: LinkItem[] = JSON.parse(cache);
          if (Array.isArray(parsed) && parsed.length >= 7) {
            const cached = parsed[6]; // Tarjeta7 -> índice 6
            if (cached?.texto) setTitle(cached.texto);
            if (cached?.url) setAddress(cached.url);
          }
        }
      } catch (err) {
        // ignore parse errors
      }

      // 2) luego intentar traer del servidor y sobreescribir si hay datos válidos
      try {
        const res = await fetch("/api/adminLinks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resource: "links", action: "read" }),
        });
        const json = await res.json();
        const items: LinkItem[] = json.links || [];

        let item = items.find(
          (it: LinkItem) => (it.key || "").toString().toLowerCase() === "tarjeta7"
        );
        if (!item && items.length >= 7) item = items[6];

        if (item) {
          if (item.texto) setTitle(item.texto);
          if (item.url) setAddress(item.url);

          // actualizar cache local para consistencia
          try {
            const cache = localStorage.getItem(LOCAL_KEY);
            const parsed: LinkItem[] = cache ? JSON.parse(cache) : [];
            for (let i = 0; i < 7; i++) {
              if (!parsed[i]) parsed[i] = { key: `Tarjeta${i + 1}`, texto: "", url: "" };
            }
            parsed[6] = {
              key: "Tarjeta7",
              texto: item.texto ?? parsed[6].texto ?? DEFAULT_TITLE,
              url: item.url ?? parsed[6].url ?? DEFAULT_URL,
            };
            localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
          } catch {
            // ignore localStorage errors
          }
        }
      } catch (err) {
        console.error("Error cargando links admin:", err);
        // mantener valores por defecto o cache local
      }
    };

    loadLinks();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{title}</h1>
      <p>Espacio para consultas, sugerencias y participación de empleados.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address={address} />
      </div>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Consulta;