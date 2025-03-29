const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const Venta = require("../models/Venta");
const Gasto = require("../models/Gasto");
const Puesto = require("../models/Puesto");

// 📌 Resumen general del día
router.get("/resumen-dia", async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Ventas de hoy
        const ventas = await Venta.find({ fecha: { $gte: hoy } }).populate("producto");
        const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
        const totalUnidades = ventas.reduce((acc, v) => acc + v.cantidad, 0);

        const ventasPorProducto = {};
        const ventasPorPuesto = {};

        ventas.forEach(v => {
            const nombre = v.producto?.nombre || "❌";
            const puesto = v.producto?.puesto?.toString();
            ventasPorProducto[nombre] = (ventasPorProducto[nombre] || 0) + v.cantidad;

            if (puesto) {
                ventasPorPuesto[puesto] = (ventasPorPuesto[puesto] || 0) + v.cantidad;
            }
        });

        // Gastos de hoy
        const gastos = await Gasto.find({ fecha: { $gte: hoy } });
        const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
        const listaGastos = gastos.map(g => ({ categoria: g.categoria, monto: g.monto }));

        // Productos por agotarse
        const productosAgotados = await Producto.find({ stock: { $lte: 5 } }).select("nombre stock");

        // Top 3 puestos con más vendidos
        const puestos = await Puesto.find();
        const puestosMap = Object.fromEntries(puestos.map(p => [p._id.toString(), p.nombre]));
        const ranking = Object.entries(ventasPorPuesto)
            .map(([id, cantidad]) => ({ puesto: puestosMap[id] || "Sin puesto", cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 3);

        // Stock total y por puesto
        const productos = await Producto.find().populate("puesto");
        const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
        const stockPorPuesto = {};
        productos.forEach(p => {
            const nombrePuesto = p.puesto?.nombre || "Sin puesto";
            stockPorPuesto[nombrePuesto] = (stockPorPuesto[nombrePuesto] || 0) + p.stock;
        });

        res.json({
            totalVentas,
            totalUnidades,
            ventasPorProducto,
            totalGastos,
            listaGastos,
            productosAgotados,
            ranking,
            totalStock,
            stockPorPuesto
        });

    } catch (err) {
        console.error("❌ Error en resumen del día:", err);
        res.status(500).json({ error: "Error al obtener resumen" });
    }
});

module.exports = router;
