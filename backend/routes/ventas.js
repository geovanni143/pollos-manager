const express = require("express");
const router = express.Router();
const Venta = require("../models/Venta");
const Producto = require("../models/Producto");

// 🟢 Registrar una venta
router.post("/", async (req, res) => {
    try {
        const { producto, cantidad } = req.body;
        
        if (!producto || !cantidad) {
            return res.status(400).json({ mensaje: "Producto y cantidad son obligatorios" });
        }

        const productoDB = await Producto.findById(producto);
        if (!productoDB) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        if (productoDB.stock < cantidad) {
            return res.status(400).json({ mensaje: "Stock insuficiente" });
        }

        // 🔹 Calcular el total basado en el precio del producto
        const total = cantidad * productoDB.precio;

        // 🔹 Actualizar el stock
        productoDB.stock -= cantidad;
        await productoDB.save();

        // 🔹 Registrar la venta con fecha automática
        const nuevaVenta = new Venta({ producto, cantidad, total, fecha: new Date() });
        await nuevaVenta.save();

        res.status(201).json({ mensaje: "✅ Venta registrada", venta: nuevaVenta });
    } catch (err) {
        console.error("❌ Error al registrar venta:", err);
        res.status(500).json({ error: "Error al registrar la venta" });
    }
});

// 🟢 Obtener el historial de ventas
router.get("/", async (req, res) => {
    try {
        const ventas = await Venta.find().populate("producto", "nombre precio").lean();

        // 🔹 Evita errores si el producto fue eliminado
        const ventasCorregidas = ventas.map(venta => ({
            ...venta,
            producto: venta.producto || { nombre: "❌ Producto eliminado", precio: 0 }, // 🔹 Reemplaza productos eliminados
            total: venta.total || (venta.cantidad * (venta.producto?.precio || 0)), // 🔹 Corrige `total` si es undefined
            fecha: new Date(venta.fecha).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) // 🔹 Formato de fecha
        }));

        console.log("📩 Ventas enviadas al frontend:", ventasCorregidas);
        res.json(ventasCorregidas);
    } catch (err) {
        console.error("❌ Error al obtener ventas:", err);
        res.status(500).json({ error: "Error al obtener ventas" });
    }
});

router.get("/", async (req, res) => {
    try {
        let { fechaInicio, fechaFin } = req.query;
        let filtro = {};

        // Si se reciben fechas, filtrar por rango de fechas
        if (fechaInicio && fechaFin) {
            filtro.fecha = { 
                $gte: new Date(fechaInicio), 
                $lte: new Date(fechaFin) 
            };
        }

        const ventas = await Venta.find(filtro).populate("producto", "nombre precio").lean();
        res.json(ventas);
    } catch (err) {
        console.error("❌ Error al obtener ventas:", err);
        res.status(500).json({ error: "Error al obtener ventas" });
    }
});




module.exports = router;
