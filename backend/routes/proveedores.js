const express = require("express");
const router = express.Router();
const Proveedor = require("../models/Proveedor");

// Obtener todos
router.get("/", async (req, res) => {
  const proveedores = await Proveedor.find();
  res.json(proveedores);
});

// Crear nuevo
router.post("/", async (req, res) => {
  const { nombre, empresa, contacto, descripcion, productos } = req.body;

  if (!nombre || (!contacto?.correo && !contacto?.telefono)) {
    return res.status(400).json({ error: "Nombre y al menos un contacto son requeridos" });
  }

  const proveedor = new Proveedor({ nombre, empresa, contacto, descripcion, productos });
  await proveedor.save();
  res.json(proveedor);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const proveedorActualizado = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(proveedorActualizado);
});

// Eliminar
router.delete("/:id", async (req, res) => {
  await Proveedor.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Proveedor eliminado" });
});

module.exports = router;
