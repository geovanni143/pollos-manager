import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    api.get("/dashboard/resumen")
      .then(res => setResumen(res.data))
      .catch(err => console.error("❌ Error al cargar resumen:", err));
  }, []);

  if (!resumen) return <p className="p-4">Cargando resumen...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-yellow-600 mb-2">🏠 Resumen del Día</h1>

      {/* 1. Ventas del Día */}
      <div className="bg-green-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">🛒 Ventas de Hoy</h2>
        <p>Total vendido: <strong>${resumen.totalVentasPesos.toFixed(2)}</strong></p>
        <p>Unidades vendidas: <strong>{resumen.totalUnidades}</strong></p>
        <ul className="list-disc list-inside mt-2">
          {Object.entries(resumen.detalleProductos).map(([nombre, cantidad]) => (
            <li key={nombre}>{nombre}: {cantidad}</li>
          ))}
        </ul>
      </div>

      {/* 2. Gastos del Día */}
      <div className="bg-red-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">💸 Gastos de Hoy</h2>
        <p>Total: <strong>${resumen.totalGastos.toFixed(2)}</strong></p>
        <ul className="list-disc list-inside mt-2">
          {resumen.resumenGastos.map((g, i) => (
            <li key={i}>{g.categoria}: ${g.monto}</li>
          ))}
        </ul>
      </div>

      {/* 3. Productos por agotarse */}
      <div className="bg-yellow-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">⚠ Productos por Agotarse</h2>
        {resumen.porAgotarse.length === 0
          ? <p>No hay productos con stock bajo.</p>
          : (
            <ul className="list-disc list-inside">
              {resumen.porAgotarse.map((p, i) => (
                <li key={i}>⚠ {p.nombre} - Stock: {p.stock}</li>
              ))}
            </ul>
          )}
      </div>

      {/* 4. Top 3 Puestos más vendidos */}
      <div className="bg-blue-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">🏆 Top 3 Puestos más Vendidos</h2>
        <ol className="list-decimal list-inside">
          {resumen.rankingPuestos.map((p, i) => (
            <li key={i}>{p.puesto}: {p.cantidad} vendidos</li>
          ))}
        </ol>
      </div>

      {/* 5. Stock total por puesto */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">📦 Stock Total por Puesto</h2>
        <ul className="list-disc list-inside">
          {Object.entries(resumen.stockPorPuesto).map(([puesto, cantidad], i) => (
            <li key={i}>{puesto}: {cantidad} en stock</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
