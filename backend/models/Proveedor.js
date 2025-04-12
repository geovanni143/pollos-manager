const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  empresa: { type: String, required: false },
  contacto: {
    correo: { type: String, required: false },  // Puede ser opcional
    telefono: { type: String, required: true }, // Necesario para todos los proveedores
  },
  descripcion: { type: String, required: false },
  productos: { type: [String], required: true }, // Listado de productos
}, { timestamps: true });

module.exports = mongoose.model('Proveedor', proveedorSchema);
