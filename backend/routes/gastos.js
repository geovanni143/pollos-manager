const express = require("express");
const router = express.Router();
const Gasto = require("../models/Gasto");

const Puesto = require("../models/Puesto");
const pdf = require("html-pdf-node");
// Registrar un gasto
router.post("/", async (req, res) => {
    try {
        const { categoria, monto, descripcion, puesto } = req.body;

        if (!categoria || !monto) {
            return res.status(400).json({ mensaje: "Categoría y monto son obligatorios" });
        }

        const nuevoGasto = new Gasto({
            categoria,
            monto,
            descripcion,
            puesto: puesto || null,
            fecha: new Date()
        });

        await nuevoGasto.save();
        res.status(201).json({ mensaje: "✅ Gasto registrado", gasto: nuevoGasto });
    } catch (err) {
        console.error("❌ Error al registrar gasto:", err);
        res.status(500).json({ error: "Error al registrar gasto" });
    }
});

// Obtener todos los gastos con nombre del puesto (si aplica)
router.get("/", async (req, res) => {
    try {
        const gastos = await Gasto.find().populate("puesto", "nombre").sort({ fecha: -1 });
        res.json(gastos);
    } catch (err) {
        console.error("❌ Error al obtener gastos:", err);
        res.status(500).json({ error: "Error al obtener gastos" });
    }
});


// 🧾 Exportar gastos a PDF
router.get("/exportar/pdf", async (req, res) => {
    try {
        const gastos = await Gasto.find().populate("puesto", "nombre");

        const htmlContent = `
            <h1 style="text-align: center; color: #f39c12;">📄 Reporte de Gastos</h1>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #eee;">
                        <th style="border: 1px solid #ccc; padding: 8px;">Categoría</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">Monto</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">Descripción</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">Fecha</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">Puesto</th>
                    </tr>
                </thead>
                <tbody>
                    ${gastos.map(gasto => `
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 8px;">${gasto.categoria}</td>
                            <td style="border: 1px solid #ccc; padding: 8px;">$${gasto.monto.toFixed(2)}</td>
                            <td style="border: 1px solid #ccc; padding: 8px;">${gasto.descripcion || "-"}</td>
                            <td style="border: 1px solid #ccc; padding: 8px;">${new Date(gasto.fecha).toLocaleDateString()}</td>
                            <td style="border: 1px solid #ccc; padding: 8px;">${gasto.puesto?.nombre || "General"}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        const file = { content: htmlContent };
        const options = { format: "A4" };

        const pdfBuffer = await pdf.generatePdf(file, options);
        res.set({ "Content-Type": "application/pdf" });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("❌ Error al exportar PDF:", err);
        res.status(500).json({ error: "Error al generar PDF" });
    }
});
module.exports = router;
