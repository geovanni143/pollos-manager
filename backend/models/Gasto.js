const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema({
  categoria: {
    type: String,
    enum: ["insumos", "renta", "sueldos", "servicios", "otros"],
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  puesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Puesto",
    required: false
  }
});

module.exports = mongoose.model("Gasto", gastoSchema);
