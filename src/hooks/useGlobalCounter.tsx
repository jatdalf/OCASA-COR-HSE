import { useEffect, useState } from "react";

export function useGlobalCounter(sectionName: string, scriptUrl: string) {
  const [visits, setVisits] = useState<number>(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = `visited_${sectionName}_${today}`;

    const updateCounter = async () => {
      try {
        const alreadyVisited = localStorage.getItem(storageKey);

        // Primero obtiene el valor actual
        const getResponse = await fetch(`${scriptUrl}?seccion=${sectionName}&get=true`, { mode: "cors" });
        const getData = await getResponse.json();
        let newCount = getData.visitas || 0;

        // Si no visitó hoy, incrementamos
        if (!alreadyVisited) {
          const incResponse = await fetch(`${scriptUrl}?seccion=${sectionName}`, { mode: "cors" });
          const incData = await incResponse.json();
          newCount = incData.visitas;
          localStorage.setItem(storageKey, "true");
        }

        setVisits(newCount);
      } catch (err) {
        console.error("Error al obtener contador:", err);
        setVisits(0);
      }
    };

    updateCounter();
  }, [sectionName, scriptUrl]);

  return visits;
}
