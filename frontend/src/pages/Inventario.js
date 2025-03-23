import { useEffect, useState } from "react";
import api from "../api";

function Inventario() {
    const [agotados, setAgotados] = useState([]);
    const [movimientos, setMovimientos] = useState([]);

    useEffect(() => {
        api.get("/productos/agotados")
            .then(res => setAgotados(res.data))
            .catch(err => console.error("❌ Error al obtener productos agotados:", err));

        api.get("/productos/movimientos")
            .then(res => setMovimientos(res.data))
            .catch(err => console.error("❌ Error al obtener movimientos de stock:", err));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-yellow-600 mb-4">📦 Reporte de Inventario</h1>

            {/* Productos por agotarse */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-red-600">🔴 Productos por agotarse</h2>
                {agotados.length === 0 ? (
                    <p className="text-gray-600">No hay productos con stock bajo.</p>
                ) : (
                    <ul className="space-y-1">
                        {agotados.map(p => (
                            <li key={p._id} className="bg-red-100 text-red-800 p-2 rounded">
                                {p.nombre} - Stock: {p.stock}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Historial de movimientos */}
            <section>
                <h2 className="text-lg font-semibold mb-2 text-gray-800">📜 Histórico de movimientos</h2>
                <table className="min-w-full border border-gray-300 bg-white rounded shadow-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-2">Producto</th>
                            <th className="text-left p-2">Tipo</th>
                            <th className="text-left p-2">Cantidad</th>
                            <th className="text-left p-2">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map(m => (
                            <tr key={m._id} className="border-t border-gray-200">
                                <td className="p-2">{m.producto?.nombre || "❌ Eliminado"}</td>
                                <td className="p-2 capitalize">{m.tipo}</td>
                                <td className="p-2">{m.cantidad}</td>
                                <td className="p-2">{new Date(m.fecha).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default Inventario;
