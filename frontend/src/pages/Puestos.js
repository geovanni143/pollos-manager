import { useEffect, useState } from "react";
import api from "../api";

function Puestos() {
    const [puestos, setPuestos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        obtenerPuestos();
    }, []);

    const obtenerPuestos = async () => {
        const res = await api.get("/puestos");
        setPuestos(res.data);
    };

    const agregarPuesto = async (e) => {
        e.preventDefault();
        try {
            await api.post("/puestos", { nombre, descripcion });
            alert("✅ Puesto registrado");
            setNombre("");
            setDescripcion("");
            obtenerPuestos();
        } catch (err) {
            console.error("❌ Error al registrar puesto:", err);
            alert("Error al registrar");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-yellow-500 text-center mb-2">Pollos Manager</h2>
                <p className="text-center text-gray-600 mb-6">Registrar Puesto</p>

                <form onSubmit={agregarPuesto} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre del puesto"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        required
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded transition"
                    >
                        Registrar
                    </button>
                </form>

                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2 text-center">Puestos Registrados</h3>
                    <ul className="space-y-1">
                        {puestos.map(p => (
                            <li key={p._id} className="border px-3 py-1 rounded text-sm">
                                🐔 {p.nombre} — <span className="text-gray-500">{p.descripcion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Puestos;
