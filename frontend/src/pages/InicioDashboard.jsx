import { useEffect, useState } from "react";
import api from "../api";

function InicioDashboard() {
    const [resumen, setResumen] = useState(null);

    useEffect(() => {
        api.get("/dashboard/resumen-dia")
            .then(res => setResumen(res.data))
            .catch(err => console.error("❌ Error al cargar resumen:", err));
    }, []);

    if (!resumen) return <p className="text-center text-gray-600">Cargando resumen...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-yellow-600">📊 Resumen del Día</h1>

            {/* Ventas del día */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg mb-2">📈 Ventas de Hoy</h2>
                <p>Total vendido: <strong>${resumen.totalVentas.toFixed(2)}</strong></p>
                <p>Unidades vendidas: <strong>{resumen.totalUnidades}</strong></p>
                <ul className="mt-2 list-disc ml-6">
                    {Object.entries(resumen.ventasPorProducto).map(([producto, cantidad]) => (
                        <li key={producto}>{producto}: {cantidad} unidades</li>
                    ))}
                </ul>
            </div>

            {/* Gastos del día */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg mb-2">🧾 Gastos de Hoy</h2>
                <p>Total: <strong className="text-red-600">${resumen.totalGastos.toFixed(2)}</strong></p>
                <ul className="mt-2 list-disc ml-6">
                    {resumen.listaGastos.map((g, i) => (
                        <li key={i}>{g.categoria}: ${g.monto.toFixed(2)}</li>
                    ))}
                </ul>
            </div>

            {/* Productos por agotarse */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg mb-2">📉 Productos por Agotarse</h2>
                {resumen.productosAgotados.length === 0 ? (
                    <p>No hay productos con stock bajo.</p>
                ) : (
                    <ul className="list-disc ml-6 text-red-600">
                        {resumen.productosAgotados.map(p => (
                            <li key={p._id}>⚠ {p.nombre} - Stock: {p.stock}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Top 3 puestos */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg mb-2">🏆 Top 3 Puestos con Más Ventas</h2>
                <ol className="list-decimal ml-6">
                    {resumen.ranking.map((r, i) => (
                        <li key={i}>{r.puesto}: {r.cantidad} unidades</li>
                    ))}
                </ol>
            </div>

            {/* Stock total */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg mb-2">📦 Stock Total</h2>
                <p>Total general: <strong>{resumen.totalStock}</strong> unidades</p>
                <ul className="mt-2 list-disc ml-6">
                    {Object.entries(resumen.stockPorPuesto).map(([puesto, cantidad]) => (
                        <li key={puesto}>{puesto}: {cantidad} unidades</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default InicioDashboard;
