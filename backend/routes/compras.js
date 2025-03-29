const express = require("express");
const router = express.Router();
const Compra = require("../models/Compra");

// Registrar una nueva compra
router.post("/", async (req, res) => {
  try {
    const { proveedor, producto, cantidad, costoUnitario } = req.body;
    const nuevaCompra = new Compra({ proveedor, producto, cantidad, costoUnitario });
    await nuevaCompra.save();
    res.json({ mensaje: "✅ Compra registrada", compra: nuevaCompra });
  } catch (err) {
    console.error("❌ Error al registrar compra:", err);
    res.status(500).json({ error: "Error al registrar compra" });
  }
});

// Obtener historial de compras por proveedor
router.get("/:proveedorId", async (req, res) => {
  try {
    const compras = await Compra.find({ proveedor: req.params.proveedorId }).sort({ fecha: -1 });
    res.json(compras);
  } catch (err) {
    console.error("❌ Error al obtener historial:", err);
    res.status(500).json({ error: "Error al obtener historial de compras" });
  }
});

module.exports = router;
