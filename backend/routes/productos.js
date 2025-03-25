const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const MovimientoStock = require("../models/MovimientoStock");

// Obtener todos los productos con puesto asignado (populate)
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find().populate("puesto", "nombre");
        res.json(productos);
    } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Crear un producto
router.post("/", async (req, res) => {
    try {
        const { nombre, precio, stock, categoria, puesto } = req.body;
        if (!nombre || !precio || !stock || !categoria) {
            return res.status(400).json({ mensaje: "Todos los campos obligatorios" });
        }

        const nuevoProducto = new Producto({ nombre, precio, stock, categoria, puesto });
        await nuevoProducto.save();
        res.json({ mensaje: "✅ Producto agregado", producto: nuevoProducto });
    } catch (err) {
        console.error("❌ Error al agregar producto:", err);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ mensaje: "✅ Producto actualizado", producto: productoActualizado });
    } catch (err) {
        console.error("❌ Error al actualizar producto:", err);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "🗑️ Producto eliminado" });
    } catch (err) {
        console.error("❌ Error al eliminar producto:", err);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

// Productos por agotarse (stock bajo)
router.get("/agotados", async (req, res) => {
    try {
        const productos = await Producto.find({ stock: { $lte: 5 } }).populate("puesto", "nombre");
        res.json(productos);
    } catch (err) {
        console.error("❌ Error al obtener productos por agotarse:", err);
        res.status(500).json({ error: "Error al obtener productos por agotarse" });
    }
});

// Obtener movimientos de stock
router.get("/movimientos", async (req, res) => {
    try {
        const movimientos = await MovimientoStock.find()
            .populate("producto", "nombre")
            .sort({ fecha: -1 });

        res.json(movimientos);
    } catch (err) {
        console.error("❌ Error al obtener movimientos de stock:", err);
        res.status(500).json({ error: "Error al obtener movimientos" });
    }
});

module.exports = router;
