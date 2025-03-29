import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTACIÓN CORRECTA
import api from "../api";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    contacto: { correo: "", telefono: "" },
    descripcion: "",
    productos: ""
  });
  const [editando, setEditando] = useState(null);

  const navigate = useNavigate(); // ✅ INSTANCIA DE NAVIGATE

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    const res = await api.get("/proveedores");
    setProveedores(res.data);
  };

  const manejarCambio = e => {
    const { name, value } = e.target;
    if (name === "correo" || name === "telefono") {
      setForm({ ...form, contacto: { ...form.contacto, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const manejarSubmit = async e => {
    e.preventDefault();
    const data = {
      ...form,
      productos: form.productos.split(",").map(p => p.trim())
    };

    if (!form.nombre || (!form.contacto.correo && !form.contacto.telefono)) {
      alert("Nombre y al menos un contacto son requeridos");
      return;
    }

    try {
      if (editando) {
        await api.put(`/proveedores/${editando}`, data);
        setEditando(null);
      } else {
        await api.post("/proveedores", data);
      }

      cargarProveedores();
      setForm({
        nombre: "", empresa: "", contacto: { correo: "", telefono: "" },
        descripcion: "", productos: ""
      });
    } catch (err) {
      alert("❌ Error al guardar proveedor");
    }
  };

  const manejarEditar = (prov) => {
    setForm({
      nombre: prov.nombre,
      empresa: prov.empresa || "",
      contacto: { correo: prov.contacto?.correo || "", telefono: prov.contacto?.telefono || "" },
      descripcion: prov.descripcion || "",
      productos: prov.productos.join(", ")
    });
    setEditando(prov._id);
  };

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Eliminar proveedor?")) {
      await api.delete(`/proveedores/${id}`);
      cargarProveedores();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">📋 Gestión de Proveedores</h1>

      <form onSubmit={manejarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6">
        <input className="input" name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} required />
        <input className="input" name="empresa" placeholder="Empresa" value={form.empresa} onChange={manejarCambio} />
        <input className="input" name="correo" placeholder="Correo" value={form.contacto.correo} onChange={manejarCambio} />
        <input className="input" name="telefono" placeholder="Teléfono" value={form.contacto.telefono} onChange={manejarCambio} />
        <input className="input col-span-2" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={manejarCambio} />
        <input className="input col-span-2" name="productos" placeholder="Productos que suministra (separados por coma)" value={form.productos} onChange={manejarCambio} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-2">
          {editando ? "Actualizar" : "Registrar Proveedor"}
        </button>
      </form>

      {/* Lista */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3 text-lg">📦 Lista de Proveedores</h2>
        <ul className="space-y-2">
          {proveedores.map(p => (
            <li key={p._id} className="border p-3 rounded flex flex-col md:flex-row justify-between">
              <div>
                <strong>{p.nombre}</strong> ({p.empresa || "Sin empresa"})<br />
                📧 {p.contacto?.correo || "-"} / 📞 {p.contacto?.telefono || "-"}<br />
                📝 {p.descripcion || "-"}<br />
                🛒 Productos: {p.productos.join(", ")}
              </div>

              <div className="flex gap-2 mt-2 md:mt-0 md:ml-4">
                <button onClick={() => manejarEditar(p)} className="bg-blue-500 text-white px-3 py-1 rounded">✏</button>
                <button onClick={() => manejarEliminar(p._id)} className="bg-red-500 text-white px-3 py-1 rounded">🗑</button>
                <button onClick={() => navigate(`/compras/${p._id}`)} className="bg-indigo-500 text-white px-2 py-1 rounded">📜 Historial</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Proveedores;
