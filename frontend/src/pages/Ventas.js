import { useState, useEffect } from "react";
import api from "../api";

function Ventas() {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        api.get("/ventas")
            .then(res => {
                console.log("📩 Ventas recibidas:", res.data);
                setVentas(res.data);
            })
            .catch(err => console.error("❌ Error al obtener ventas:", err));
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Historial de Ventas</h1>
            <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Producto</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>Cantidad</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta._id} 
                            style={{ borderBottom: "1px solid #ddd", color: venta.producto ? "black" : "red", textAlign: "center" }}>
                            <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                                {venta.producto && venta.producto.nombre 
                                    ? venta.producto.nombre
                                    : <span style={{ color: "red" }}>❌ Producto eliminado</span>}
                            </td>
                            <td style={{ padding: "12px" }}>{venta.cantidad}</td>
                            <td style={{ padding: "12px" }}>
                                {venta.producto 
                                    ? `$${venta.total || (venta.cantidad * (venta.producto.precio || 0))}`
                                    : "$0"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Ventas;
