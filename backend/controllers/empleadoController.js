const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Empleado = require("../models/Empleado");

const loginEmpleado = async (req, res) => {
  const { correo, password } = req.body;

  try {
    console.log("🔐 Intentando login con:", correo);

    const empleado = await Empleado.findOne({ "contacto.correo": correo });

    if (!empleado) {
      console.log("❌ Correo no registrado");
      return res.status(404).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    if (empleado.bloqueado) {
      console.log("⛔ Cuenta bloqueada");
      return res.status(403).json({ mensaje: "Cuenta bloqueada por múltiples intentos fallidos" });
    }

    const esValido = await bcrypt.compare(password, empleado.password);

    if (!esValido) {
      empleado.intentosFallidos = (empleado.intentosFallidos || 0) + 1;
      if (empleado.intentosFallidos >= 3) {
        empleado.bloqueado = true;
        await empleado.save();
        console.log("🚫 Cuenta bloqueada");
        return res.status(403).json({ mensaje: "Cuenta bloqueada por intentos fallidos" });
      }
      await empleado.save();
      console.log("❌ Contraseña incorrecta");
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    empleado.intentosFallidos = 0;
    await empleado.save();

    const token = jwt.sign(
      { id: empleado._id, rol: empleado.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      rol: empleado.rol,
      id: empleado._id,
      nombre: empleado.nombre,
      pin: empleado.rol === "dueño" ? empleado.pin : undefined,
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};

module.exports = { loginEmpleado };
