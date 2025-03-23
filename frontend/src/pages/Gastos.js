import { useState, useEffect } from "react";
import api from "../api";

function Gastos() {
    const [gastos, setGastos] = useState([]);
    const [categoria, setCategoria] = useState("insumos");
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [totalGastos, setTotalGastos] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);

    useEffect(() => {
        obtenerGastos();
        obtenerVentas();
    }, []);

    const obtenerGastos = async () => {
        const res = await api.get("/gastos");
        setGastos(res.data);
        const total = res.data.reduce((sum, g) => sum + g.monto, 0);
        setTotalGastos(total);
    };

    const obtenerVentas = async () => {
        const res = await api.get("/ventas");
        const total = res.data.reduce((sum, v) => sum + v.total, 0);
        setTotalVentas(total);
    };

    const registrarGasto = async (e) => {
        e.preventDefault();
        try {
            await api.post("/gastos", { categoria, monto: Number(monto), descripcion });
            setCategoria("insumos");
            setMonto("");
            setDescripcion("");
            obtenerGastos();
        } catch (err) {
            alert("❌ Error al registrar gasto");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-yellow-600">Planificador de Gastos</h1>

                <form onSubmit={registrarGasto} className="space-y-4 mb-6">
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="insumos">Insumos</option>
                        <option value="renta">Renta</option>
                        <option value="sueldos">Sueldos</option>
                        <option value="servicios">Servicios</option>
                        <option value="otros">Otros</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Monto"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full border p-2 rounded"
                    />

                    <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded">
                        Registrar Gasto
                    </button>
                </form>

                <div className="mb-4">
                    <h2 className="font-semibold">Total Gastos: <span className="text-red-600">${totalGastos}</span></h2>
                    <h2 className="font-semibold">Ganancias: <span className="text-green-600">${totalVentas - totalGastos}</span></h2>
                </div>

                <ul className="divide-y">
                    {gastos.map((g) => (
                        <li key={g._id} className="py-2">
                            <span className="font-bold">{g.categoria}</span>: ${g.monto} - {g.descripcion}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Gastos;
