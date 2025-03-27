import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const iniciarSesion = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/empleados/login", { correo, password });
            localStorage.setItem("token", res.data.token);
            alert("✅ Sesión iniciada correctamente");
            navigate("/empleados"); // Redirige según el rol si quieres
        } catch (err) {
            alert("❌ Error en el login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex justify-center items-center p-4">
            <div className="bg-white shadow-md rounded-xl w-full max-w-sm p-6 text-center">
              
                <img src="/logo192.jpg" alt="Logo" className="w-16 h-16 mx-auto mb-2" />
<h1 className="text-2xl font-extrabold text-yellow-500 mb-1">Pollos Manager</h1>


                <h2 className="text-lg font-semibold mb-4">Iniciar Sesión</h2>
                <form onSubmit={iniciarSesion} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        className="w-full border rounded-md p-2 text-sm"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border rounded-md p-2 text-sm"
                        required
                    />
                    <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-md font-semibold">
                        INICIAR SESIÓN
                    </button>
                </form>

                <div className="mt-4 space-y-2">
                    <button onClick={() => navigate("/empleados")} className="w-full border border-yellow-500 text-yellow-600 py-2 rounded-md text-sm font-medium hover:bg-yellow-100">
                        REGISTRARSE
                    </button>
                    <button onClick={() => navigate("/login-admin")} className="w-full border border-yellow-500 text-yellow-600 py-2 rounded-md text-sm font-medium hover:bg-yellow-100">
                        ACCEDER COMO ADMINISTRADOR
                    </button>
                    <button onClick={() => alert("Función no disponible aún")} className="w-full text-yellow-600 text-sm hover:underline">
                        ¿OLVIDASTE TU CONTRASEÑA?
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
