import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function LoginAdmin() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/empleados/login", { correo, password });

      if (!res.data?.token || res.data.rol !== "dueño") {
        alert("❌ Esta cuenta no es de tipo dueño o las credenciales son incorrectas");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);

      alert("✅ Acceso como dueño confirmado");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("❌ Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const irARegistroDueño = () => {
    navigate("/empleados", { state: { rolDefault: "dueño" } });
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <img src="/logo192.jpg" className="w-16 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-yellow-600">Acceso Administrador</h1>
        <p className="text-sm mb-4">Solo cuentas tipo "dueño"</p>

        <form onSubmit={iniciarSesion} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Verificando..." : "INICIAR COMO DUEÑO"}
          </button>
        </form>

        <button
          onClick={irARegistroDueño}
          className="mt-4 w-full border border-yellow-400 text-yellow-500 py-2 rounded hover:bg-yellow-100"
        >
          REGISTRAR NUEVA CUENTA DE DUEÑO
        </button>

        <button
          onClick={() => navigate("/login")}
          className="mt-2 text-sm text-yellow-600 hover:underline"
        >
          ← Volver al login de empleados
        </button>
      </div>
    </div>
  );
}

export default LoginAdmin;
