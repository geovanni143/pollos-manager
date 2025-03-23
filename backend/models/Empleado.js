const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    rol: { type: String, enum: ['dueño', 'vendedor'], required: true },
    contacto: {
        telefono: { type: String, required: true },
        correo: { type: String, required: true, unique: true }
    },
    password: { type: String, required: true },  // Para la autenticación
    fechaCreacion: { type: Date, default: Date.now }
});

const Empleado = mongoose.model("Empleado", empleadoSchema);

module.exports = Empleado;
