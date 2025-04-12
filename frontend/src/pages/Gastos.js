import { useEffect, useState } from "react";
import api from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Gastos() {
    const [gastos, setGastos] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [formulario, setFormulario] = useState({
        categoria: "",
        monto: "",
        descripcion: "",
        puesto: ""
    });

    useEffect(() => {
        cargarGastos();
        cargarPuestos();
    }, []);

    const cargarGastos = async () => {
        try {
            const res = await api.get("/gastos");
            setGastos(res.data);
        } catch (err) {
            console.error("❌ Error al cargar gastos:", err);
        }
    };

    const cargarPuestos = async () => {
        try {
            const res = await api.get("/puestos");
            setPuestos(res.data);
        } catch (err) {
            console.error("❌ Error al cargar puestos:", err);
        }
    };

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const enviarFormulario = async (e) => {
        e.preventDefault();
        const nuevoGasto = {
            ...formulario,
            monto: Number(formulario.monto),
            puesto: formulario.puesto || null
        };

        try {
            await api.post("/gastos", nuevoGasto);
            cargarGastos();
            setFormulario({ categoria: "", monto: "", descripcion: "", puesto: "" });
        } catch (err) {
            console.error("❌ Error al registrar gasto:", err);
        }
    };

    //Exportar PDF
    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text("📄 Reporte de Gastos", 14, 15);

        const filas = gastos.map(g => [
            g.categoria,
            `$${g.monto.toFixed(2)}`,
            g.descripcion || "-",
            new Date(g.fecha).toLocaleDateString(),
            g.puesto?.nombre || "General"
        ]);

        autoTable(doc, {
            head: [["Categoría", "Monto", "Descripción", "Fecha", "Puesto"]],
            body: filas,
            startY: 20,
            styles: { fontSize: 10 }
        });

        doc.save("reporte_gastos.pdf");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-yellow-600">💸 Gestión de Gastos</h1>
                <button onClick={exportarPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    📤 Exportar a PDF
                </button>
            </div>

            {/* Formulario */}
            <form onSubmit={enviarFormulario} className="space-y-3 bg-white p-4 rounded shadow mb-6">
                <select name="categoria" value={formulario.categoria} onChange={manejarCambio} className="input" required>
                    <option value="">Selecciona categoría</option>
                    <option value="insumos">Insumos</option>
                    <option value="renta">Renta</option>
                    <option value="sueldos">Sueldos</option>
                    <option value="servicios">Servicios</option>
                    <option value="otros">Otros</option>
                </select>

                <input type="number" name="monto" placeholder="Monto" value={formulario.monto} onChange={manejarCambio} className="input" required />
                <input type="text" name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={manejarCambio} className="input" />

                <select name="puesto" value={formulario.puesto} onChange={manejarCambio} className="input">
                    <option value="">Sin puesto (gasto general)</option>
                    {puestos.map(p => (
                        <option key={p._id} value={p._id}>{p.nombre}</option>
                    ))}
                </select>

                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    Registrar Gasto
                </button>
            </form>

            {/* Tabla */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm text-center border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Categoría</th>
                            <th className="px-4 py-2 border">Monto</th>
                            <th className="px-4 py-2 border">Descripción</th>
                            <th className="px-4 py-2 border">Fecha</th>
                            <th className="px-4 py-2 border">Puesto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((g, i) => (
                            <tr key={i} className="border-t">
                                <td className="px-4 py-2 border capitalize">{g.categoria}</td>
                                <td className="px-4 py-2 border text-red-600">${g.monto.toFixed(2)}</td>
                                <td className="px-4 py-2 border">{g.descripcion || "-"}</td>
                                <td className="px-4 py-2 border">{new Date(g.fecha).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border">{g.puesto?.nombre || "General"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Gastos;
