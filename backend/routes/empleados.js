const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Empleado = require("../models/Empleado");
const crypto = require("crypto");

const router = express.Router();

// 🔓 REGISTRO ABIERTO PARA TODOS
router.post("/registrar", async (req, res) => {
  try {
    const { nombre, rol, contacto, password, pin, puesto } = req.body;

    if (!nombre || !rol || !contacto || !password || !contacto.correo || !contacto.telefono) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const correoNormalizado = contacto.correo.toLowerCase().trim();

    const existente = await Empleado.findOne({ "contacto.correo": correoNormalizado });
    if (existente) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    const nuevoEmpleado = new Empleado({
      nombre,
      rol,
      contacto: {
        correo: correoNormalizado,
        telefono: contacto.telefono
      },
      password
    });

    if (rol === "empleado") {
      if (!pin || !puesto) {
        return res.status(400).json({ mensaje: "El PIN del dueño y el puesto son obligatorios." });
      }

      const dueño = await Empleado.findOne({ pin, rol: "dueño" });
      if (!dueño) {
        return res.status(404).json({ mensaje: "PIN inválido. No se encontró dueño asociado." });
      }

      nuevoEmpleado.dueño = dueño._id;
      nuevoEmpleado.puesto = puesto;
    }

    await nuevoEmpleado.save();

    const token = jwt.sign({ id: nuevoEmpleado._id, rol: nuevoEmpleado.rol }, process.env.JWT_SECRET || "secreto", {
      expiresIn: "1d"
    });

    if (rol === "dueño") {
      return res.status(201).json({
        mensaje: "Dueño registrado correctamente",
        pin: nuevoEmpleado.pin,
        token
      });
    }

    res.status(201).json({ mensaje: "Empleado registrado correctamente", token });

  } catch (err) {
    console.error("❌ Error al registrar:", err);
    res.status(500).json({ mensaje: "Error interno al registrar" });
  }
});

// 🔓 LOGIN - CUALQUIER EMPLEADO O DUEÑO
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    const correoNormalizado = correo.toLowerCase().trim();

    const empleado = await Empleado.findOne({ "contacto.correo": correoNormalizado });
    if (!empleado) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    if (empleado.bloqueado) {
      return res.status(403).json({ mensaje: "Cuenta bloqueada. Contacta al administrador." });
    }

    const esCorrecto = await bcrypt.compare(password, empleado.password);
    if (!esCorrecto) {
      empleado.intentosFallidos = (empleado.intentosFallidos || 0) + 1;

      if (empleado.intentosFallidos >= 3) {
        empleado.bloqueado = true;
      }

      await empleado.save();
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    empleado.intentosFallidos = 0;
    await empleado.save();

    const token = jwt.sign({ id: empleado._id, rol: empleado.rol }, process.env.JWT_SECRET || "secreto", {
      expiresIn: "1d"
    });

    res.json({
      mensaje: "Login exitoso",
      token,
      rol: empleado.rol,
      id: empleado._id,
      nombre: empleado.nombre,
      pin: empleado.rol === "dueño" ? empleado.pin : undefined
    });
  } catch (err) {
    console.error("❌ Error general en login:", err);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
});

module.exports = router;
