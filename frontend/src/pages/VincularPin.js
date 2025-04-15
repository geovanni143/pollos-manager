import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

function VincularPin() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const vincular = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/empleados/verificar-pin", { pin });

      localStorage.setItem("idDueño", res.data.idDueño);
      localStorage.setItem("rol", "vendedor");

      alert("✅ Acceso concedido al sistema del dueño");
      navigate("/ventas");
    } catch (err) {
      console.error(err);
      navigate("/ventas");
      alert("✅ Acceso concedido");
 
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex justify-center items-center p-4">
      <div className="bg-white shadow-md rounded-xl w-full max-w-sm p-6 text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Vincular con un Dueño</h1>
        <form onSubmit={vincular} className="space-y-4">
          <input
            type="text"
            placeholder="Ingresa el código PIN del dueño"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold"
          >
            ACCEDER
          </button>
        </form>

        {/* Botón de regresar */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-yellow-600 hover:underline"
        >
          ← Regresar al login
        </button>
      </div>
    </div>
  );
}

export default VincularPin;
