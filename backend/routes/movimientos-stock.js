const express = require("express");
const router = express.Router();
const MovimientoStock = require("../models/MovimientoStock");
const Producto = require("../models/Producto");

// Registrar un movimiento de stock
router.post("/", async (req, res) => {
  try {
    const { producto, tipo, cantidad, descripcion } = req.body;
    if (!producto || !tipo || !cantidad) {
      return res.status(400).json({ mensaje: "Campos obligatorios faltantes" });
    }

    const productoDB = await Producto.findById(producto);
    if (!productoDB) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (tipo === "entrada") productoDB.stock += cantidad;
    else if (tipo === "salida") productoDB.stock -= cantidad;

    await productoDB.save();

    const movimiento = new MovimientoStock({ producto, tipo, cantidad, descripcion });
    await movimiento.save();

    res.status(201).json({ mensaje: "Movimiento registrado", movimiento });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar movimiento de stock" });
  }
});

// Obtener historial de movimientos
router.get("/", async (req, res) => {
  const movimientos = await MovimientoStock.find().populate("producto", "nombre").sort({ fecha: -1 });
  res.json(movimientos);
});

module.exports = router;
