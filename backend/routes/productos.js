const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");

// Obtener todos los productos
router.get("/", async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
});

// Crear un producto
router.post("/", async (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;
    if (!nombre || !precio || !stock || !categoria) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    const nuevoProducto = new Producto({ nombre, precio, stock, categoria });
    await nuevoProducto.save();
    res.json({ mensaje: "Producto agregado", producto: nuevoProducto });
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ mensaje: "Producto actualizado", producto: productoActualizado });
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado" });
});

module.exports = router;
