const crypto = require("crypto");
const Empleado = require("../models/Empleado");

async function generarPinUnico() {
  let pin;
  let existe = true;

  while (existe) {
    pin = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 caracteres
    existe = await Empleado.findOne({ pin });
  }

  return pin;
}

module.exports = generarPinUnico;
