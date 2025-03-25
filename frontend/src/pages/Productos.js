import { useState, useEffect } from "react";
import api from "../api";

function Productos() {
    const [productosPorPuesto, setProductosPorPuesto] = useState({});
    const [puestos, setPuestos] = useState([]);

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoria, setCategoria] = useState("");
    const [puesto, setPuesto] = useState("");

    const [editando, setEditando] = useState(null);

    useEffect(() => {
        obtenerProductos();
        api.get("/puestos")
            .then(res => setPuestos(res.data))
            .catch(err => console.error("❌ Error al cargar puestos:", err));
    }, []);

    const obtenerProductos = () => {
        api.get("/productos")
            .then(res => {
                const agrupados = res.data.reduce((acc, producto) => {
                    const nombrePuesto = producto.puesto?.nombre || "Sin puesto";
                    if (!acc[nombrePuesto]) acc[nombrePuesto] = [];
                    acc[nombrePuesto].push(producto);
                    return acc;
                }, {});
                setProductosPorPuesto(agrupados);
            })
            .catch(err => console.error("❌ Error al obtener productos:", err));
    };

    const agregarProducto = (e) => {
        e.preventDefault();
        if (!nombre || !precio || !stock || !categoria || !puesto) {
            alert("⚠️ Todos los campos son obligatorios");
            return;
        }

        const nuevoProducto = {
            nombre: nombre.trim(),
            precio: Number(precio),
            stock: Number(stock),
            categoria: categoria.trim(),
            puesto
        };

        const req = editando
            ? api.put(`/productos/${editando}`, nuevoProducto)
            : api.post("/productos", nuevoProducto);

        req.then(() => {
            obtenerProductos();
            setNombre(""); setPrecio(""); setStock(""); setCategoria(""); setPuesto(""); setEditando(null);
        }).catch(err =>
            alert("❌ Error al guardar producto: " + err.response?.data?.mensaje || err.message)
        );
    };

    const eliminarProducto = (id) => {
        api.delete(`/productos/${id}`)
            .then(obtenerProductos)
            .catch(() => alert("❌ Error al eliminar producto"));
    };

    const editarProducto = (producto) => {
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        setStock(producto.stock);
        setCategoria(producto.categoria);
        setPuesto(producto.puesto?._id || "");
        setEditando(producto._id);
    };

    const venderProducto = (id) => {
        api.post("/ventas", { producto: id, cantidad: 1 })
            .then(() => {
                alert("✅ Venta registrada");
                obtenerProductos();
            })
            .catch(() => alert("❌ Error al vender"));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center text-yellow-600">🛒 Gestión de Productos</h1>

            {/* Formulario */}
            <form onSubmit={agregarProducto} className="space-y-2 mb-8">
                <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="input" required />
                <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} className="input" required />
                <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="input" required />
                <input type="text" placeholder="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} className="input" required />
                <select value={puesto} onChange={e => setPuesto(e.target.value)} className="input" required>
                    <option value="">Seleccione un puesto</option>
                    {puestos.map(p => (
                        <option key={p._id} value={p._id}>{p.nombre}</option>
                    ))}
                </select>
                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            {/* Productos agrupados por puesto */}
            {Object.entries(productosPorPuesto).map(([puestoNombre, productos]) => (
                <div key={puestoNombre} className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">📍 {puestoNombre}</h2>
                    <ul className="space-y-2">
                        {productos.map(producto => (
                            <li key={producto._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <span>{producto.nombre} - ${producto.precio} - Stock: {producto.stock} - Categoría: {producto.categoria}</span>
                                <div className="space-x-2">
                                    <button onClick={() => venderProducto(producto._id)} className="bg-green-500 text-white px-3 py-1 rounded">🛒</button>
                                    <button onClick={() => editarProducto(producto)} className="bg-blue-500 text-white px-3 py-1 rounded">✏</button>
                                    <button onClick={() => eliminarProducto(producto._id)} className="bg-red-500 text-white px-3 py-1 rounded">🗑</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default Productos;
