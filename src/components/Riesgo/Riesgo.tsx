import React, { useEffect, useState } from "react";
import AccessButton from "../AccessButton/AccessButton";
import { useGlobalCounters } from "../../hooks/useGlobalCounters";

const SCRIPT_URL = "/api/proxiCounter"; // 🔹 llama al proxy
const LOCAL_KEY = "admin_links";

interface LinkItem {
  key: string;
  texto?: string;
  url?: string;
}

const DEFAULT_TITLE = "Evaluación de riesgo por puesto";
const DEFAULT_URL = "https://drive.google.com/drive/folders/1HtQJZHlsNG1qf-5TXr2gqFkO5C_yhtrq";

const Riesgo: React.FC = () => {
  const { visits } = useGlobalCounters("Riesgo", SCRIPT_URL);

  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [address, setAddress] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const loadLinks = async () => {
      // 1) leer cache local si existe (ver cambios inmediatamente)
      try {
        const cache = localStorage.getItem(LOCAL_KEY);
        if (cache) {
          const parsed: LinkItem[] = JSON.parse(cache);
          if (Array.isArray(parsed) && parsed.length >= 5) {
            const cached = parsed[4]; // Tarjeta5 -> índice 4
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
          (it: LinkItem) => (it.key || "").toString().toLowerCase() === "tarjeta5"
        );
        if (!item && items.length >= 5) item = items[4];

        if (item) {
          if (item.texto) setTitle(item.texto);
          if (item.url) setAddress(item.url);

          // actualizar cache local para consistencia
          try {
            const cache = localStorage.getItem(LOCAL_KEY);
            const parsed: LinkItem[] = cache ? JSON.parse(cache) : [];
            // asegurar al menos 5 entradas
            for (let i = 0; i < 5; i++) {
              if (!parsed[i]) parsed[i] = { key: `Tarjeta${i + 1}`, texto: "", url: "" };
            }
            parsed[4] = {
              key: "Tarjeta5",
              texto: item.texto ?? parsed[4].texto ?? DEFAULT_TITLE,
              url: item.url ?? parsed[4].url ?? DEFAULT_URL,
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
      <p>Herramientas y documentación para análisis de riesgo.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address={address} />
      </div>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Riesgo;