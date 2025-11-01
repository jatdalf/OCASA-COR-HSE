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

const DEFAULT_TITLE = "Noticias La Voz";
const DEFAULT_URL = "https://drive.google.com/file/d/1VFR0M7g2qHnf4gG21wk_DmMGXK_8pO2X/view";

const Noticias: React.FC = () => {
  const { visits } = useGlobalCounters("Noticias", SCRIPT_URL);

  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [address, setAddress] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const loadLinks = async () => {
      // 1) leer cache local para ver cambios inmediatamente
      try {
        const cache = localStorage.getItem(LOCAL_KEY);
        if (cache) {
          const parsed: LinkItem[] = JSON.parse(cache);
          if (Array.isArray(parsed) && parsed.length >= 4) {
            const cached = parsed[3]; // Tarjeta4 -> índice 3
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

        let item = items.find((it: LinkItem) => (it.key || "").toString().toLowerCase() === "tarjeta4");
        if (!item && items.length >= 4) item = items[3];

        if (item) {
          if (item.texto) setTitle(item.texto);
          if (item.url) setAddress(item.url);

          // actualizar cache local para consistencia
          try {
            const cache = localStorage.getItem(LOCAL_KEY);
            const parsed: LinkItem[] = cache ? JSON.parse(cache) : [];
            // asegurar al menos 4 entradas
            for (let i = 0; i < 4; i++) {
              if (!parsed[i]) parsed[i] = { key: `Tarjeta${i + 1}`, texto: "", url: "" };
            }
            parsed[3] = {
              key: "Tarjeta4",
              texto: item.texto ?? parsed[3].texto ?? DEFAULT_TITLE,
              url: item.url ?? parsed[3].url ?? DEFAULT_URL,
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
      <p>Sección para mostrar noticias y actualizaciones.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address={address} />
      </div>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Noticias;