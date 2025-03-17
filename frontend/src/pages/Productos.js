import { useState, useEffect } from "react";
import api from "../api";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoria, setCategoria] = useState("");  
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        obtenerProductos();
    }, []);

    function obtenerProductos() {
        api.get("/productos")
            .then(res => setProductos(res.data))
            .catch(err => console.error("❌ Error al obtener productos:", err));
    }

    function agregarProducto(e) {
        e.preventDefault();

        if (!nombre.trim() || !precio || !stock || !categoria.trim()) {
            alert("⚠️ Todos los campos son obligatorios");
            return;
        }

        const nuevoProducto = { 
            nombre: nombre.trim(), 
            precio: Number(precio), 
            stock: Number(stock), 
            categoria: categoria.trim()
        };

        console.log("📩 Datos enviados al backend:", nuevoProducto);

        if (editando) {
            api.put(`/productos/${editando}`, nuevoProducto)
                .then(() => {
                    obtenerProductos();
                    setEditando(null);
                })
                .catch(err => console.error("❌ Error al actualizar producto:", err.response ? err.response.data : err));
        } else {
            api.post("/productos", nuevoProducto)
                .then(() => obtenerProductos())
                .catch(err => console.error("❌ Error al agregar producto:", err.response ? err.response.data : err));
        }

        setNombre("");
        setPrecio("");
        setStock("");
        setCategoria("");
    }

    function eliminarProducto(id) {
        api.delete(`/productos/${id}`)
            .then(() => obtenerProductos())
            .catch(err => alert("❌ Error al eliminar producto"));
    }

    function editarProducto(producto) {
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        setStock(producto.stock);
        setCategoria(producto.categoria);
        setEditando(producto._id);
    }

    // 📌 Función para vender un producto (reduce el stock)
    function venderProducto(id) {
        api.post("/ventas", { producto: id, cantidad: 1 })  // 🔹 Se vende 1 unidad por defecto
            .then(() => {
                alert("✅ Venta registrada con éxito");
                obtenerProductos();  // 🔹 Se actualiza la lista de productos para reflejar el stock actualizado
            })
            .catch(err => alert("❌ Error al registrar la venta"));
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333" }}>Gestión de Productos</h1>

            {/* Formulario para Agregar / Editar Producto */}
            <form onSubmit={agregarProducto} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} required />
                <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
                <input type="text" placeholder="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} required />
                <button type="submit" style={{ backgroundColor: editando ? "#ffc107" : "#28a745", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            {/* Lista de productos */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {productos.map((producto) => (
                    <li key={producto._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #ddd", padding: "10px", borderRadius: "8px", marginBottom: "10px", backgroundColor: "#f9f9f9" }}>
                        <span>{producto.nombre} - ${producto.precio} - Stock: {producto.stock} - Categoría: {producto.categoria}</span>
                        <div>
                            <button onClick={() => venderProducto(producto._id)} style={{ backgroundColor: "#28a745", color: "white", marginRight: "5px", padding: "5px 10px", border: "none", cursor: "pointer" }}>🛒 Vender</button>
                            <button onClick={() => editarProducto(producto)} style={{ backgroundColor: "#007bff", color: "white", marginRight: "5px", padding: "5px 10px", border: "none", cursor: "pointer" }}>✏ Editar</button>
                            <button onClick={() => eliminarProducto(producto._id)} style={{ backgroundColor: "#dc3545", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>🗑 Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Productos;
