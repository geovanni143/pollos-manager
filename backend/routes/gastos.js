const express = require("express");
const router = express.Router();
const Gasto = require("../models/Gasto");

// 🟢 Registrar gasto
router.post("/", async (req, res) => {
  try {
    const { categoria, monto, descripcion } = req.body;
    const nuevoGasto = new Gasto({ categoria, monto, descripcion });
    await nuevoGasto.save();
    res.status(201).json({ mensaje: "Gasto registrado", gasto: nuevoGasto });
  } catch (err) {
    console.error("❌ Error al registrar gasto:", err);
    res.status(500).json({ mensaje: "Error al registrar gasto" });
  }
});

// 🟢 Obtener todos los gastos
router.get("/", async (req, res) => {
  try {
    const gastos = await Gasto.find().sort({ fecha: -1 });
    res.json(gastos);
  } catch (err) {
    console.error("❌ Error al obtener gastos:", err);
    res.status(500).json({ mensaje: "Error al obtener gastos" });
  }
});

module.exports = router;
