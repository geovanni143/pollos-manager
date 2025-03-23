const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now },
    
    // 🔥 Relación con Puesto
    puesto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Puesto",
        required: false // Puedes hacer que sea obligatorio si todos los productos deben estar en un puesto
    }
});

module.exports = mongoose.model("Producto", ProductoSchema);
