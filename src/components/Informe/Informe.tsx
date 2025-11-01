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

const DEFAULT_TITLE = "Informe 2025";
const DEFAULT_URL = "https://sites.google.com/ocasa.com/calidad-hse-corporativo/cali2023?authuser=0";

const Informe: React.FC = () => {
  const { visits } = useGlobalCounters("Informe", SCRIPT_URL);

  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [address, setAddress] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const loadLinks = async () => {
      // 1) leer cache local si existe (ver cambios inmediatamente)
      try {
        const cache = localStorage.getItem(LOCAL_KEY);
        if (cache) {
          const parsed: LinkItem[] = JSON.parse(cache);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            const cached = parsed[1]; // Tarjeta2 -> índice 1
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
          (it: LinkItem) => (it.key || "").toString().toLowerCase() === "tarjeta2"
        );
        if (!item && items.length >= 2) item = items[1];

        if (item) {
          if (item.texto) setTitle(item.texto);
          if (item.url) setAddress(item.url);

          // actualizar cache local para consistencia
          try {
            const cache = localStorage.getItem(LOCAL_KEY);
            const parsed: LinkItem[] = cache ? JSON.parse(cache) : [];
            // asegurar al menos 2 entradas
            for (let i = 0; i < 2; i++) {
              if (!parsed[i]) parsed[i] = { key: `Tarjeta${i + 1}`, texto: "", url: "" };
            }
            parsed[1] = {
              key: "Tarjeta2",
              texto: item.texto ?? parsed[1].texto ?? DEFAULT_TITLE,
              url: item.url ?? parsed[1].url ?? DEFAULT_URL,
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
      <p>Informe anual y documentación relevante.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address={address} />
      </div>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Informe;