import { useState, useEffect } from "react";
import api from "../api";

function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    useEffect(() => {
        obtenerVentas();
    }, []);

    const obtenerVentas = () => {
        let url = "/ventas";
        if (fechaInicio && fechaFin) {
            url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        }
        
        api.get(url)
            .then(res => setVentas(res.data))
            .catch(err => console.error("❌ Error al obtener ventas:", err));
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Historial de Ventas de Pollos-Manager</h1>
            
            {/* Filtros */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                <button onClick={obtenerVentas} style={{ backgroundColor: "#007bff", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
                    Filtrar
                </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                        <th style={{ padding: "12px", textAlign: "left" }}>Producto</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Cantidad</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Total</th>
                        <th style={{ padding: "12px", textAlign: "center" }}>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta._id} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
                            <td style={{ padding: "12px" }}>
                                {venta.producto ? venta.producto.nombre : "❌ Producto eliminado"}
                            </td>
                            <td style={{ padding: "12px" }}>{venta.cantidad}</td>
                            <td style={{ padding: "12px" }}>${venta.total}</td>
                            <td style={{ padding: "12px" }}>{(venta.fecha)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Ventas;
