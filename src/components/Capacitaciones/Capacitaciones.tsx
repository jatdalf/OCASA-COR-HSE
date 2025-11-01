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

const DEFAULT_TITLE = "Capacitaciones 2025";
const DEFAULT_URL = "https://drive.google.com/drive/folders/1I7gwfOHFFJVyzVR4Qrl_VOeqorIf1y9_";

const Capacitaciones: React.FC = () => {
  const { visits } = useGlobalCounters("Capacitaciones", SCRIPT_URL);

  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [address, setAddress] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    const loadLinks = async () => {
      // 1) leer cache local si existe (para ver cambios inmediatamente)
      try {
        const cache = localStorage.getItem(LOCAL_KEY);
        if (cache) {
          const parsed: LinkItem[] = JSON.parse(cache);
          if (Array.isArray(parsed) && parsed.length >= 1) {
            const item = parsed[0];
            if (item?.texto) setTitle(item.texto);
            if (item?.url) setAddress(item.url);
          }
        }
      } catch (err) {
        // ignore parse errors
        console.warn("No se pudo leer cache local de admin_links", err);
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

        let item = items.find((it: LinkItem) => (it.key || "").toString().toLowerCase() === "tarjeta1");
        if (!item && items.length >= 1) item = items[0];

        if (item) {
          if (item.texto) {
            setTitle(item.texto);
            // actualizar cache local con el texto del servidor para mantener consistencia
            try {
              const cache = localStorage.getItem(LOCAL_KEY);
              const parsed: LinkItem[] = cache ? JSON.parse(cache) : [];
              parsed[0] = { key: "Tarjeta1", texto: item.texto, url: item.url ?? parsed[0]?.url ?? DEFAULT_URL };
              localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
            } catch {}
          }
          if (item.url) {
            setAddress(item.url);
            try {
              const cache = localStorage.getItem(LOCAL_KEY);
              const parsed: LinkItem[] = cache ? JSON.parse(cache) : [];
              parsed[0] = { key: "Tarjeta1", texto: item.texto ?? parsed[0]?.texto ?? DEFAULT_TITLE, url: item.url };
              localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
            } catch {}
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
      <p>Lista de cursos, entrenamientos y materiales de formación.</p>
      <div style={{ margin: "55px" }}>
        <AccessButton address={address} />
      </div>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        🔢 Visitas globales: <strong>{visits !== null ? visits : "Cargando..."}</strong>
      </p>
    </div>
  );
};

export default Capacitaciones;