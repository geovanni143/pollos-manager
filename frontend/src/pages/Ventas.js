import { useState, useEffect } from "react";
import api from "../api";

function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [ventasDia, setVentasDia] = useState(null);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    useEffect(() => {
        obtenerVentas();
        obtenerVentasDelDia();
    }, []);

    const obtenerVentas = () => {
        if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
            alert("⚠️ Por favor selecciona ambas fechas para filtrar.");
            return;
        }

        let url = "/ventas";
        if (fechaInicio && fechaFin) {
            url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        }

        api.get(url)
            .then(res => setVentas(res.data))
            .catch(err => console.error("❌ Error al obtener ventas:", err));
    };

    const obtenerVentasDelDia = () => {
        api.get("/ventas-del-dia")
            .then(res => setVentasDia(res.data))
            .catch(err => console.error("❌ Error al obtener ventas del día:", err));
    };

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl text-gray-700 text-center mb-6 font-semibold">📊 Historial de Ventas de Pollos-Manager</h1>

            {/* Ventas del Día */}
            {ventasDia && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-3 text-green-700">📅 Resumen de ventas del día</h2>
                    <p className="mb-2"><strong>Total Ventas: </strong> ${ventasDia.totalVentas}</p>
                    <p className="mb-2"><strong>Total Unidades Vendidas: </strong> {ventasDia.totalUnidades}</p>
                    <div>
                        <strong>Detalle por producto:</strong>
                        <ul className="list-disc ml-6 mt-2">
                            {ventasDia.detalleProductos.map((item, idx) => (
                                <li key={idx}>
                                    {item.producto}: {item.cantidad} unidades (${item.total})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="flex gap-2 mb-4">
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    className="border rounded p-2"
                />
                <button
                    onClick={obtenerVentas}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
                >
                    🔎 Filtrar
                </button>
            </div>

            {/* Tabla de Ventas */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-200 text-left">
                            <th className="px-4 py-2">Producto</th>
                            <th className="px-4 py-2 text-center">Cantidad</th>
                            <th className="px-4 py-2 text-center">Total</th>
                            <th className="px-4 py-2 text-center">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.length > 0 ? (
                            ventas.map((venta) => (
                                <tr key={venta._id} className="border-b border-gray-200 text-center">
                                    <td className="px-4 py-2">
                                        {venta.producto ? venta.producto.nombre : "❌ Producto eliminado"}
                                    </td>
                                    <td className="px-4 py-2">{venta.cantidad}</td>
                                    <td className="px-4 py-2">${venta.total}</td>
                                    <td className="px-4 py-2">{new Date(venta.fecha).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                    Sin resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Ventas;
