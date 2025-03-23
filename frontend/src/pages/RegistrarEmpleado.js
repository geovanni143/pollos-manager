import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function RegistrarEmpleado() {
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState("vendedor");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const registrarEmpleado = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/empleados/registrar", {
                nombre,
                rol,
                contacto: { correo, telefono },
                password
            });
            alert(response.data.mensaje);
            navigate("/login"); // Redirige al login tras registro
        } catch (err) {
            console.error("❌ Error en frontend:", err);
            alert("❌ Error al registrar empleado");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-yellow-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-6">
                    <img src="/logo192.jpg" alt="Logo" className="w-16 h-16 mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-yellow-500">Pollos Manager</h1>
                    <h2 className="text-lg text-gray-700">Registrar Empleado</h2>
                </div>

                <form onSubmit={registrarEmpleado} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />

                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full border rounded px-4 py-2"
                    >
                        <option value="vendedor">Vendedor</option>
                        <option value="dueño">Dueño</option>
                    </select>

                    <input
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />

                    <input
                        type="tel"
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-4 py-2"
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded"
                    >
                        Registrar
                    </button>
                </form>

                <button
                    onClick={() => navigate("/login")}
                    className="w-full mt-4 border border-yellow-400 text-yellow-500 hover:bg-yellow-100 font-semibold py-2 rounded"
                >
                    Volver al Login
                </button>
            </div>
        </div>
    );
}

export default RegistrarEmpleado;
