import { useEffect, useState } from "react";

interface SectionCounter {
  seccion: string;
  visitas: number;
}

interface AllCounters {
  [key: string]: number;
}

export function useGlobalCounters(sectionName?: string, scriptUrl?: string) {
  const [visits, setVisits] = useState<number | null>(null);
  const [allVisits, setAllVisits] = useState<AllCounters | null>(null);

  useEffect(() => {
    if (!scriptUrl) return;

    const today = new Date().toISOString().split("T")[0];
    const storageKey = sectionName ? `visited_${sectionName}_${today}` : null;

    const fetchCounters = async () => {
      try {
        if (sectionName) {
          const alreadyVisited = localStorage.getItem(storageKey!);

          const response = await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seccion: sectionName }),
          });

          const data: SectionCounter = await response.json();
          setVisits(data.visitas || 0);

          if (!alreadyVisited) {
            localStorage.setItem(storageKey!, "true");
          }
        }

        // Obtener todos los contadores (opcional)
        const allResponse = await fetch(`${scriptUrl}?all=true`);
        const allData = await allResponse.json();

        if (allData.resumen && Array.isArray(allData.resumen)) {
          const allObj: AllCounters = {};
          allData.resumen.forEach((item: SectionCounter) => {
            allObj[item.seccion] = item.visitas;
          });
          setAllVisits(allObj);
        }
      } catch (err) {
        console.error("Error al obtener contadores:", err);
        if (sectionName) setVisits(0);
        setAllVisits(null);
      }
    };

    fetchCounters();
  }, [sectionName, scriptUrl]);

  return { visits, allVisits };
}