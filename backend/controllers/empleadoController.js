const Empleado = require("../models/Empleado");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTRO
const registrarEmpleado = async (req, res) => {
  try {
    const { nombre, rol, contacto, password, pin, puesto } = req.body;
    const correo = contacto?.correo?.toLowerCase().trim();
    const telefono = contacto?.telefono;

    if (!correo || !telefono || !password || !nombre || !rol) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    const existe = await Empleado.findOne({ "contacto.correo": correo });
    if (existe) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    const nuevoEmpleado = new Empleado({
      nombre,
      rol,
      contacto: { correo, telefono },
      password,
    });

    if (rol === "empleado") {
      if (!pin) return res.status(400).json({ mensaje: "El PIN del dueño es obligatorio." });

      const dueño = await Empleado.findOne({ rol: "dueño", pin });
      if (!dueño) return res.status(404).json({ mensaje: "PIN inválido o dueño no encontrado." });

      if (!puesto) return res.status(400).json({ mensaje: "Debe especificar el puesto." });

      nuevoEmpleado.dueño = dueño._id;
      nuevoEmpleado.puesto = puesto;
    }

    await nuevoEmpleado.save();

    if (rol === "dueño") {
      return res.json({ mensaje: "Dueño registrado correctamente", pin: nuevoEmpleado.pin });
    }

    res.json({ mensaje: "Empleado registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    res.status(500).json({ mensaje: "Error al registrar. Verifica los datos o intenta más tarde." });
  }
};

// LOGIN
const loginEmpleado = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const correoNormalizado = correo.toLowerCase().trim();
    const empleado = await Empleado.findOne({ "contacto.correo": correoNormalizado });

    if (!empleado) return res.status(404).json({ mensaje: "Correo o contraseña incorrectos" });
    if (empleado.bloqueado) return res.status(403).json({ mensaje: "Cuenta bloqueada por intentos fallidos" });

    const esValido = await bcrypt.compare(password, empleado.password);
    if (!esValido) {
      empleado.intentosFallidos = (empleado.intentosFallidos || 0) + 1;
      if (empleado.intentosFallidos >= 3) empleado.bloqueado = true;
      await empleado.save();
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    empleado.intentosFallidos = 0;
    await empleado.save();

    const token = jwt.sign({ id: empleado._id, rol: empleado.rol }, process.env.JWT_SECRET || "secreto", {
      expiresIn: "1d"
    });

    res.json({
      token,
      rol: empleado.rol,
      id: empleado._id,
      nombre: empleado.nombre,
      pin: empleado.rol === "dueño" ? empleado.pin : undefined
    });
  } catch (error) {
    console.error("❌ Error general en login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};

// VINCULAR PIN A EMPLEADO DESDE /vincular-pin
const vincularConDueño = async (req, res) => {
  try {
    const { pin } = req.body;
    const empleadoId = req.user.id;

    const empleado = await Empleado.findById(empleadoId);
    if (!empleado || empleado.rol !== "empleado") {
      return res.status(403).json({ mensaje: "Solo los empleados pueden vincularse" });
    }

    const dueño = await Empleado.findOne({ rol: "dueño", pin });
    if (!dueño) {
      return res.status(404).json({ mensaje: "PIN no válido o dueño no encontrado" });
    }

    empleado.dueño = dueño._id;
    await empleado.save();

    res.json({ mensaje: "Empleado vinculado correctamente", dueño: dueño.nombre });
  } catch (error) {
    console.error("❌ Error al vincular con dueño:", error);
    res.status(500).json({ mensaje: "Error interno al vincular" });
  }
};

module.exports = {
  registrarEmpleado,
  loginEmpleado,
  vincularConDueño
};
