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

const SCRIPT_URL = "https://script.google.com/macros/s/TU_URL_DEL_SCRIPT/exec";

const Visitas: React.FC = () => {
  const [data, setData] = useState<VisitaData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?all=true`);
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
    // 🔁 Actualiza cada 30 segundos automáticamente
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📊 Estadísticas de Visitas</h1>

      {loading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
        <>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="seccion" tick={{ fill: "#333" }} />
                <YAxis allowDecimals={false} tick={{ fill: "#333" }} />
                <Tooltip />
                <Bar
                  dataKey="visitas"
                  fill="#48d09a"
                  animationDuration={1000}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

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
                  <td>{item.visitas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Visitas;
