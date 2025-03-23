const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    rol: { type: String, enum: ['dueño', 'vendedor'], required: true },
    contacto: {
        telefono: { type: String, required: true },
        correo: { type: String, required: true, unique: true }
    },
    password: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now },

    // 🔥 Relación con Puesto
    puesto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Puesto",
        required: false
    }
});

const Empleado = mongoose.model("Empleado", empleadoSchema);

module.exports = Empleado;
