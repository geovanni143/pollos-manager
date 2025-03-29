const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contacto: { type: String, required: true },
  empresa: { type: String, required: true },
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto"
    }
  ],
  compras: [
    {
      fecha: { type: Date, default: Date.now },
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      cantidad: Number,
      precioUnitario: Number
    }
  ]
});

module.exports = mongoose.model("Proveedor", proveedorSchema);
