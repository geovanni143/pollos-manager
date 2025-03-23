const express = require("express");
const router = express.Router();
const Venta = require("../models/Venta");
const Producto = require("../models/Producto");
const MovimientoStock = require("../models/MovimientoStock"); // ✅ importado correctamente

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

        const total = cantidad * productoDB.precio;

        // 🔄 Actualizar stock
        productoDB.stock -= cantidad;
        await productoDB.save();

        // 🧾 Registrar venta
        const nuevaVenta = new Venta({ producto, cantidad, total, fecha: new Date() });
        await nuevaVenta.save();

        // 🔁 Registrar movimiento de stock (salida)
        await MovimientoStock.create({
            producto,
            tipo: "salida",
            cantidad,
            fecha: new Date()
        });

        res.status(201).json({ mensaje: "✅ Venta registrada", venta: nuevaVenta });
    } catch (err) {
        console.error("❌ Error al registrar venta:", err);
        res.status(500).json({ error: "Error al registrar la venta" });
    }
});

// 🟢 Obtener el historial de ventas (con opción de filtro por fecha)
router.get("/", async (req, res) => {
    try {
        let { fechaInicio, fechaFin } = req.query;
        let filtro = {};

        if (fechaInicio && fechaFin) {
            filtro.fecha = {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFin)
            };
        }

        const ventas = await Venta.find(filtro)
            .populate("producto", "nombre precio")
            .sort({ fecha: -1 })
            .lean();

        const ventasCorregidas = ventas.map(venta => {
            const producto = venta.producto || { nombre: "❌ Producto eliminado", precio: 0 };
            const total = venta.total || (venta.cantidad * producto.precio);

            const fechaFormateada = venta.fecha
                ? new Date(venta.fecha).toLocaleString("es-MX", {
                      timeZone: "America/Mexico_City",
                      dateStyle: "short",
                      timeStyle: "short"
                  })
                : "Sin fecha";

            return {
                ...venta,
                producto,
                total,
                fecha: fechaFormateada
            };
        });

        res.json(ventasCorregidas);
    } catch (err) {
        console.error("❌ Error al obtener ventas:", err);
        res.status(500).json({ error: "Error al obtener ventas" });
    }
});

module.exports = router;
