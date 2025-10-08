import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./Visitas.module.css";

interface VisitaData {
  seccion: string;
  visitas: number;
}

const SCRIPT_URL = "/api/proxiCounter";

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    
    const duration = 800; // ms
    const stepTime = Math.max(Math.floor(duration / value), 20);
    let current = 0;

    const step = () => {
      current++;
      setDisplay((prev) => (prev < value ? prev + 1 : value));
      if (current < value) {
        setTimeout(step, stepTime);
      }
    };

    setDisplay(0);
    if (value > 0) step();
    else setDisplay(0);
    // eslint-disable-next-line
  }, [value]);

  return <span>{display}</span>;
};

const Visitas: React.FC = () => {
  const [data, setData] = useState<VisitaData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seccion: "all" }),
      });
      const json = await response.json();
      setData(json.resumen || []);
    } catch (err) {
      console.error("Error al obtener los datos de visitas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
       <section className={styles.gridVisitas}>

         <table className={styles.table}>
            <thead>
              <tr>
                <th>Sección</th>
                <th>Visitas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.seccion}>
                  <td>{item.seccion}</td>
                  <td className={styles.animatedNumber}>
                    <AnimatedNumber value={item.visitas} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

      <h1 className={styles.title}>📊 Estadísticas de Visitas</h1>

      {loading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
        <>


          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                layout="vertical" // <-- Cambia la orientación
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#333" }} />
                <YAxis type="category" dataKey="seccion" tick={{ fill: "#333" }} />
                <Tooltip />
                <Bar
                dataKey="visitas"
                fill="#49cbb5ff"
                animationDuration={1000}
                radius={[6, 6, 0, 0]}
                />
            </BarChart>
            </ResponsiveContainer>

           
          </div>
         
        </>
      )}
      </section>
    </div>
  );
};

export default Visitas;