const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true
  },
  producto: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  costoUnitario: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Compra", compraSchema);
