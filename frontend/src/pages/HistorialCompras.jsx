import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function HistorialCompras() {
  const { id } = useParams(); // ID del proveedor
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    api.get(`/compras/${id}`)
      .then(res => setCompras(res.data))
      .catch(err => console.error("❌ Error al cargar historial:", err));
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">📜 Historial de Compras</h1>
      {compras.length === 0 ? (
        <p className="text-gray-500">Este proveedor no tiene compras registradas.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-center border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Producto</th>
                <th className="px-4 py-2 border">Cantidad</th>
                <th className="px-4 py-2 border">Costo Unitario</th>
                <th className="px-4 py-2 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 border">{c.producto}</td>
                  <td className="px-4 py-2 border">{c.cantidad}</td>
                  <td className="px-4 py-2 border">${c.costoUnitario.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{new Date(c.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistorialCompras;
