import React, { useCallback, useEffect, useState } from "react";
import styles from "./AdminLinks.module.css";

type LinkItem = { key: string; texto: string; url: string };

const DEFAULT_LINKS: LinkItem[] = [
  { key: "Tarjeta1", texto: "Capacitaciones 2025", url: "https://drive.google.com/drive/folders/1I7gwfOHFFJVyzVR4Qrl_VOeqorIf1y9_" },
  { key: "Tarjeta2", texto: "Informe 2025", url: "https://sites.google.com/ocasa.com/calidad-hse-corporativo/cali2023?authuser=0" },
  { key: "Tarjeta3", texto: "Accidentes/Incidentes", url: "https://drive.google.com/drive/folders/1tzixwGLg-sroKwzenR87iDkT9Kr-XIFA" },
  { key: "Tarjeta4", texto: "Noticias La Voz", url: "https://drive.google.com/file/d/1VFR0M7g2qHnf4gG21wk_DmMGXK_8pO2X/view" },
  { key: "Tarjeta5", texto: "Evaluacion de riesgo por puesto", url: "https://drive.google.com/drive/folders/1HtQJZHlsNG1qf-5TXr2gqFkO5C_yhtrq" },
  { key: "Tarjeta6", texto: "Aspectos e impactos ambientales", url: "https://docs.google.com/spreadsheets/d/1V5gqncd7HVsCx-sawhLuyRggCJ26g9-y/edit#gid=1500150030" },
  { key: "Tarjeta7", texto: "Consulta y participacion", url: "https://docs.google.com/forms/d/e/1FAIpQLSeoMAcP1-ppxgFs9vaf7tmBB8o9pi8gAB1Ih2sRahpYwq-YEQ/viewform" },
];

const LOCAL_KEY = "admin_links";

// CLIENT_ADMIN_TOKEN viene del .env (REACT_APP_ADMIN_TOKEN)
// Atención: exponer el token en el cliente no es seguro en producción.
const CLIENT_ADMIN_TOKEN =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_ADMIN_TOKEN)
    ? String(process.env.REACT_APP_ADMIN_TOKEN).trim()
    : "";
    
const AdminLinks: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    // primero cargar cache local si existe (para respuesta inmediata)
    try {
      const cache = localStorage.getItem(LOCAL_KEY);
      if (cache) {
        const parsed = JSON.parse(cache);
        if (Array.isArray(parsed) && parsed.length) setLinks(parsed);
      }
    } catch (e) {
      // ignore
    }

    // luego intentar traer del servidor
    try {
      const res = await fetch("/api/adminLinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ resource: "links", action: "read" }),
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.links)) {
        // normalizar y garantizar 7 items
        const serverLinks: LinkItem[] = (json.links || []).map((l: any, i: number) => ({
          key: l.key ?? `Tarjeta${i + 1}`,
          texto: l.texto ?? l.text ?? l.label ?? l.key ?? `Tarjeta ${i + 1}`,
          url: l.url ?? l.link ?? "",
        }));
        const merged: LinkItem[] = [];
        for (let i = 0; i < 7; i++) {
          merged.push(serverLinks[i] ?? DEFAULT_LINKS[i] ?? { key: `Tarjeta${i + 1}`, texto: `Tarjeta ${i + 1}`, url: "" });
        }
        setLinks(merged);
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(merged)); } catch {}
        setMessage("Links cargados.");
      } else {
        // si no hay datos del servidor, mantener lo que haya (cache o defaults)
        setMessage("Usando valores locales o por defecto.");
      }
    } catch (err) {
      console.error("loadLinks error:", err);
      setMessage("Error al cargar desde servidor. Usando cache/local.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2500);
    }
  }, [token]);

  const saveLinks = useCallback(async () => {
    // validación cliente contra REACT_APP_ADMIN_TOKEN
    if (CLIENT_ADMIN_TOKEN) {
      if (token.trim() !== CLIENT_ADMIN_TOKEN) {
        setMessage("Token inválido. Verifica tu token y vuelve a intentar.");
        setTimeout(() => setMessage(null), 2500);
        return;
      }
    } else {
      // si no configuraste REACT_APP_ADMIN_TOKEN en .env mostrar aviso pero permitir intento
      console.warn("REACT_APP_ADMIN_TOKEN no configurada. Intentando guardar igualmente.");
    }

    setSaving(true);
    setMessage(null);
    try {
      const payload = { resource: "links", action: "write", links: links.map(l => ({ key: l.key, texto: l.texto, url: l.url })) };
      const res = await fetch("/api/adminLinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error guardando");
      // sincronizar cache local
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(links)); } catch {}
      setMessage("Guardado correctamente.");
    } catch (err) {
      console.error("saveLinks error:", err);
      setMessage("Error al guardar. Revisa token/servidor.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  }, [links, token]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  // actualiza estado y localStorage inmediatamente al escribir
  const updateField = useCallback((index: number, field: "texto" | "url", value: string) => {
    setLinks(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(copy)); } catch {}
      return copy;
    });
  }, []);

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Administrar Links de Tarjetas</h1>
        <div className={styles.controls}>
          <input
            className={styles.tokenInput}
            placeholder="Admin token (opcional)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button className={styles.btn} onClick={loadLinks} disabled={loading}>
            {loading ? "Cargando..." : "Recargar"}
          </button>
          <button className={styles.btnPrimary} onClick={saveLinks} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </header>

      {message && <div className={styles.message}>{message}</div>}

      <section className={styles.grid}>
        {links.map((item, i) => (
          <div className={styles.card} key={item.key}>
            <div className={styles.cardHeader}>
              <div className={styles.cardLabel}>{item.key}</div>
              <div className={styles.cardIndex}>#{i + 1}</div>
            </div>

            <label className={styles.fieldLabel}>Texto</label>
            <input
              className={styles.input}
              value={item.texto}
              onChange={(e) => updateField(i, "texto", e.target.value)}
            />

            <label className={styles.fieldLabel}>Link</label>
            <input
              className={styles.input}
              value={item.url}
              onChange={(e) => updateField(i, "url", e.target.value)}
            />

            <div className={styles.cardActions}>
              <a className={styles.openLink} href={item.url || "#"} target="_blank" rel="noreferrer">
                Abrir
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminLinks;