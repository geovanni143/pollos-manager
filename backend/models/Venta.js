const mongoose = require("mongoose");

const VentaSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    cantidad: { type: Number, required: true },
    precioTotal: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Venta", VentaSchema);
