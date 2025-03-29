import { useState } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ReporteGanancias() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [datos, setDatos] = useState([]);

    const obtenerDatos = async () => {
        try {
            const url = `/reportes/ganancias-por-puesto?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            const res = await api.get(url);
            setDatos(res.data);
        } catch (err) {
            console.error("❌ Error al obtener el reporte:", err);
        }
    };

    const chartData = {
        labels: datos.map(d => d.puesto),
        datasets: [
            {
                label: "Ventas",
                data: datos.map(d => d.ventas),
                backgroundColor: "rgba(0, 123, 255, 0.7)",
            },
            {
                label: "Gastos",
                data: datos.map(d => d.gastos),
                backgroundColor: "rgba(220, 53, 69, 0.7)",
            },
            {
                label: "Ganancia",
                data: datos.map(d => d.ganancia),
                backgroundColor: "rgba(40, 167, 69, 0.7)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "💰 Reporte de Ganancias por Puesto" },
        },
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-yellow-600 mb-4">💸 Reporte de Ganancias por Puesto</h1>

            {/* Filtros de fechas */}
            <div className="flex gap-4 items-center mb-6">
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="input"
                />
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="input"
                />
                <button
                    onClick={obtenerDatos}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Filtrar
                </button>
            </div>

            {/* Gráfico de ganancias por puesto */}
            <div className="bg-white p-4 rounded shadow mb-8">
                <Bar data={chartData} options={options} />
            </div>

            {/* Totales */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-600 text-white p-4 rounded text-center">
                    <h2>Total Ventas</h2>
                    <p>{datos.reduce((sum, d) => sum + d.ventas, 0).toFixed(2)}</p>
                </div>
                <div className="bg-red-600 text-white p-4 rounded text-center">
                    <h2>Total Gastos</h2>
                    <p>{datos.reduce((sum, d) => sum + d.gastos, 0).toFixed(2)}</p>
                </div>
                <div className="bg-green-600 text-white p-4 rounded text-center">
                    <h2>Ganancia Neta</h2>
                    <p>{datos.reduce((sum, d) => sum + d.ganancia, 0).toFixed(2)}</p>
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
                                <td className="px-4 py-2 border">${d.ventas.toFixed(2)}</td>
                                <td className="px-4 py-2 border text-red-600">${d.gastos.toFixed(2)}</td>
                                <td className="px-4 py-2 border text-green-600">${d.ganancia.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReporteGanancias;
