import { useEffect, useState } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";

// Registro obligatorio para evitar errores de useRef
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function ReporteGanancias() {
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const obtenerDatos = async () => {
    try {
      let url = "/reportes/ganancias-por-puesto";
      if (fechaInicio && fechaFin) {
        url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }

      const res = await api.get(url);
      setDatos(res.data);
    } catch (err) {
      console.error("❌ Error al obtener reporte:", err);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  // Fallbacks por si algún valor viene vacío
  const totalVentas = datos.reduce((sum, d) => sum + (d.ventas || 0), 0);
  const totalGastos = datos.reduce((sum, d) => sum + (d.gastos || 0), 0);
  const totalGanancia = datos.reduce((sum, d) => sum + (d.ganancia || 0), 0);

  const chartData = {
    labels: datos.map(d => d.puesto),
    datasets: [
      {
        label: "Ventas",
        data: datos.map(d => d.ventas || 0),
        backgroundColor: "rgba(0, 123, 255, 0.7)",
      },
      {
        label: "Gastos",
        data: datos.map(d => d.gastos || 0),
        backgroundColor: "rgba(220, 53, 69, 0.7)",
      },
      {
        label: "Ganancia",
        data: datos.map(d => d.ganancia || 0),
        backgroundColor: "rgba(40, 167, 69, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "💰 Ganancias por Puesto",
        font: { size: 20 },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-4">📊 Reporte de Ganancias por Puesto</h1>

      {/* Filtros */}
      <div className="mb-6 flex gap-4 items-center">
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border px-3 py-1 rounded" />
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border px-3 py-1 rounded" />
        <button onClick={obtenerDatos} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Filtrar</button>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <Bar data={chartData} options={options} />
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-white mb-8">
        <div className="bg-blue-600 p-4 rounded">
          <h2 className="text-lg font-semibold">Total Ventas</h2>
          <p className="text-2xl font-bold">${totalVentas.toFixed(2)}</p>
        </div>
        <div className="bg-red-600 p-4 rounded">
          <h2 className="text-lg font-semibold">Total Gastos</h2>
          <p className="text-2xl font-bold">${totalGastos.toFixed(2)}</p>
        </div>
        <div className="bg-green-600 p-4 rounded">
          <h2 className="text-lg font-semibold">Ganancia Neta</h2>
          <p className="text-2xl font-bold">${totalGanancia.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla Detallada */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-center border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Puesto</th>
              <th className="px-4 py-2 border">Ventas</th>
              <th className="px-4 py-2 border">Gastos</th>
              <th className="px-4 py-2 border">Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((d, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 border">{d.puesto}</td>
                <td className="px-4 py-2 border">${(d.ventas || 0).toFixed(2)}</td>
                <td className="px-4 py-2 border text-red-600">${(d.gastos || 0).toFixed(2)}</td>
                <td className="px-4 py-2 border text-green-600">${(d.ganancia || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReporteGanancias;
