const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Producto", ProductoSchema);
