import { useState, useEffect } from "react";
import api from "../api";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        obtenerProductos();
    }, []);

    async function obtenerProductos() {
        try {
            const res = await api.get("/productos");
            setProductos(res.data);
        } catch (err) {
            alert("❌ Error al obtener productos");
            console.error(err);
        }
    }

    async function agregarProducto(e) {
        e.preventDefault();
        if (!nombre || !precio || !stock) {
            alert("⚠ Todos los campos son obligatorios.");
            return;
        }

        const nuevoProducto = { 
            nombre, 
            precio: Number(precio), 
            stock: Number(stock) 
        };

        try {
            if (editando) {
                await api.put(`/productos/${editando}`, nuevoProducto);
                setEditando(null);
            } else {
                await api.post("/productos", nuevoProducto);
            }
            obtenerProductos();
        } catch (err) {
            alert("❌ Error al guardar producto");
            console.error(err);
        }

        setNombre("");
        setPrecio("");
        setStock("");
    }

    async function eliminarProducto(id) {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

        try {
            await api.delete(`/productos/${id}`);
            obtenerProductos();
        } catch (err) {
            alert("❌ Error al eliminar producto");
            console.error(err);
        }
    }

    function editarProducto(producto) {
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        setStock(producto.stock);
        setEditando(producto._id);
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333" }}>Gestión de Productos</h1>

            <form onSubmit={agregarProducto} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} required />
                <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
                <button type="submit" style={{ 
                    backgroundColor: editando ? "#ffc107" : "#28a745", 
                    color: "white", 
                    padding: "5px 10px", 
                    border: "none", 
                    cursor: "pointer" 
                }}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        <li key={producto._id} style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            border: "1px solid #ddd", 
                            padding: "10px", 
                            borderRadius: "8px", 
                            marginBottom: "10px", 
                            backgroundColor: "#f9f9f9" 
                        }}>
                            <span>{producto.nombre} - ${producto.precio} - Stock: {producto.stock}</span>
                            <div>
                                <button onClick={() => editarProducto(producto)} style={{ 
                                    backgroundColor: "#007bff", 
                                    color: "white", 
                                    marginRight: "5px", 
                                    padding: "5px 10px", 
                                    border: "none", 
                                    cursor: "pointer" 
                                }}>✏ Editar</button>
                                <button onClick={() => eliminarProducto(producto._id)} style={{ 
                                    backgroundColor: "#dc3545", 
                                    color: "white", 
                                    padding: "5px 10px", 
                                    border: "none", 
                                    cursor: "pointer" 
                                }}>🗑 Eliminar</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p style={{ textAlign: "center", color: "#777" }}>No hay productos disponibles.</p>
                )}
            </ul>
        </div>
    );
}

export default Productos;
