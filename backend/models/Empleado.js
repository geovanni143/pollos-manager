const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const empleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rol: { type: String, enum: ['dueño', 'empleado'], required: true },
  contacto: {
    telefono: { type: String, required: true },
    correo: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    }
  },
  password: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  pin: { type: String, unique: true, sparse: true },
  puesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Puesto",
    required: false
  },
  intentosFallidos: { type: Number, default: 0 },
  bloqueado: { type: Boolean, default: false }
});

async function generarPinUnico() {
  let pin, existe = true;
  while (existe) {
    pin = crypto.randomBytes(3).toString("hex");
    existe = await mongoose.models.Empleado.findOne({ pin });
  }
  return pin;
}

empleadoSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.rol === "dueño" && !this.pin) {
    this.pin = await generarPinUnico();
  }
  if (this.rol === "empleado") {
    this.pin = undefined;
    if (!this.puesto) {
      return next(new Error("Un empleado debe estar asignado a un puesto."));
    }
  }
  next();
});

const Empleado = mongoose.model("Empleado", empleadoSchema);
module.exports = Empleado;
