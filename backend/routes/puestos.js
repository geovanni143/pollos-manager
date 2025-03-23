const express = require("express");
const router = express.Router();
const Puesto = require("../models/Puesto");

// Crear puesto
router.post("/", async (req, res) => {
    try {
        const nuevoPuesto = new Puesto(req.body);
        await nuevoPuesto.save();
        res.status(201).json({ mensaje: "Puesto creado", puesto: nuevoPuesto });
    } catch (err) {
        res.status(500).json({ error: "Error al crear puesto" });
    }
});

// Listar puestos
router.get("/", async (req, res) => {
    const puestos = await Puesto.find();
    res.json(puestos);
});

// Actualizar puesto
router.put("/:id", async (req, res) => {
    const actualizado = await Puesto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ mensaje: "Puesto actualizado", puesto: actualizado });
});

// Eliminar puesto
router.delete("/:id", async (req, res) => {
    await Puesto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Puesto eliminado" });
});

module.exports = router;
