const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const MovimientoStock = require("../models/MovimientoStock"); // importa el modelo


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

// 🔴 Productos por agotarse (stock bajo)
router.get("/agotados", async (req, res) => {
    try {
        const productos = await Producto.find({ stock: { $lte: 5 } }); // Puedes ajustar el número si quieres
        res.json(productos);
    } catch (err) {
        console.error("❌ Error al obtener productos por agotarse:", err);
        res.status(500).json({ error: "Error al obtener productos por agotarse" });
    }
});
// Obtener histórico de movimientos de stock
router.get("/movimientos", async (req, res) => {
    try {
      const movimientos = await MovimientoStock.find()
        .populate("producto", "nombre")
        .sort({ fecha: -1 });
  
      res.json(movimientos);
    } catch (err) {
      console.error("❌ Error al obtener movimientos:", err);
      res.status(500).json({ error: "Error al obtener movimientos de stock" });
    }
  });
  

module.exports = router;
