const express = require("express");
const router = express.Router();
const Venta = require("../models/Venta");
const Producto = require("../models/Producto");

// Obtener todas las ventas
router.get("/", async (req, res) => {
    try {
        const ventas = await Venta.find().populate("producto");
        res.json(ventas);
    } catch (error) {
        console.error("❌ Error al obtener ventas:", error);
        res.status(500).json({ mensaje: "Error al obtener ventas", error });
    }
});

// Registrar una venta
router.post("/", async (req, res) => {
    console.log("📩 Petición POST a /ventas recibida:", req.body); // <-- Log para depurar
    try {
        const { producto, cantidad } = req.body;
        const productoExistente = await Producto.findById(producto);

        if (!productoExistente || cantidad > productoExistente.stock) {
            return res.status(400).json({ mensaje: "Stock insuficiente o producto no encontrado" });
        }

        const precioTotal = productoExistente.precio * cantidad;
        const nuevaVenta = new Venta({ producto, cantidad, precioTotal });
        await nuevaVenta.save();

        // Reducir el stock del producto
        productoExistente.stock -= cantidad;
        await productoExistente.save();

        res.json({ mensaje: "Venta registrada", venta: nuevaVenta });
    } catch (error) {
        console.error("❌ Error al registrar venta:", error);
        res.status(500).json({ mensaje: "Error al registrar venta", error });
    }
});

module.exports = router;
