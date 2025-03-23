const mongoose = require("mongoose");

const PuestoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Puesto", PuestoSchema);
