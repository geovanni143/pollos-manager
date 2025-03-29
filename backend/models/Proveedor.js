const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  empresa: { type: String },
  contacto: {
    correo: { type: String },
    telefono: { type: String }
  },
  descripcion: { type: String },
  productos: [String],
  compras: [
    {
      fecha: { type: Date, default: Date.now },
      productos: [String]
    }
  ]
});

module.exports = mongoose.model("Proveedor", proveedorSchema);
