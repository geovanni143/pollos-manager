const express = require("express");
const router = express.Router();
const Gasto = require("../models/Gasto");
const Venta = require("../models/Venta");
const Puesto = require("../models/Puesto");
const Producto = require("../models/Producto");

// 🔍 Obtener reporte de ganancias por puesto con filtro de fecha
router.get("/ganancias-por-puesto", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validación de fechas
    if (fechaInicio && isNaN(Date.parse(fechaInicio))) {
      return res.status(400).json({ error: "Fecha de inicio inválida" });
    }
    if (fechaFin && isNaN(Date.parse(fechaFin))) {
      return res.status(400).json({ error: "Fecha de fin inválida" });
    }

    // Filtro de fechas
    let filtroFecha = {};
    if (fechaInicio && fechaFin) {
      filtroFecha.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    // Obtener todos los puestos
    const puestos = await Puesto.find();

    // Obtener los datos de ganancias para cada puesto
    const resultados = await Promise.all(
      puestos.map(async (puesto) => {
        // Productos relacionados al puesto
        const productos = await Producto.find({ puesto: puesto._id });
        const productoIds = productos.map((p) => p._id);

        // Ventas dentro del rango de fechas
        const ventas = await Venta.find({ producto: { $in: productoIds }, ...filtroFecha });
        const totalVentas = ventas.reduce((sum, v) => sum + (v.total || 0), 0);

        // Gastos dentro del rango de fechas
        const gastos = await Gasto.find({ puesto: puesto._id, ...filtroFecha });
        const totalGastos = gastos.reduce((sum, g) => sum + (g.monto || 0), 0);

        return {
          puesto: puesto.nombre,
          ventas: totalVentas,
          gastos: totalGastos,
          ganancia: totalVentas - totalGastos,
        };
      })
    );

    // Ordenar por ganancia (de mayor a menor)
    const ranking = resultados.sort((a, b) => b.ganancia - a.ganancia);

    res.json(ranking);
  } catch (err) {
    console.error("❌ Error en /ganancias-por-puesto:", err);
    res.status(500).json({ error: "Error al calcular ganancias por puesto" });
  }
});

module.exports = router;
