const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Empleado = require("../models/Empleado");
const { verificarJWT, verificarAdmin } = require("../middleware/auth"); // Importa los middlewares

const router = express.Router();

// 🟢 Registrar un empleado (protegido por JWT y solo para administradores)
router.post("/registrar", verificarJWT, verificarAdmin, async (req, res) => {
    try {
        // Verificar que los datos estén completos
        const { nombre, rol, contacto, password } = req.body;
        console.log("Datos recibidos:", req.body);  // Depurar los datos que se reciben

        if (!nombre || !rol || !contacto || !password) {
            console.log("Error: Faltan datos obligatorios");
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Verificar si el correo ya está en uso
        const empleadoExistente = await Empleado.findOne({ "contacto.correo": contacto.correo });
        if (empleadoExistente) {
            console.log("Error: Correo ya registrado");
            return res.status(400).json({ mensaje: "Correo ya registrado" });
        }

        // Encriptar la contraseña
        const passwordEncriptado = await bcrypt.hash(password, 10);

        // Crear el nuevo empleado
        const nuevoEmpleado = new Empleado({
            nombre,
            rol,
            contacto,
            password: passwordEncriptado
        });

        // Guardar el empleado
        await nuevoEmpleado.save();
        console.log("Empleado registrado:", nuevoEmpleado);  // Depurar el empleado registrado
        res.status(201).json({ mensaje: "Empleado registrado", empleado: nuevoEmpleado });

    } catch (err) {
        console.error("❌ Error al registrar empleado:", err);
        res.status(500).json({ error: "Error al registrar empleado" });
    }
});

// 🟢 Iniciar sesión (no protegido, accesible para todos)
router.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body;
        console.log("Datos de login recibidos:", req.body);  // Depurar datos de login

        const empleado = await Empleado.findOne({ "contacto.correo": correo });
        if (!empleado) {
            console.log("Error: Correo no encontrado");
            return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        // Verificar la contraseña
        const passwordCorrecto = await bcrypt.compare(password, empleado.password);
        if (!passwordCorrecto) {
            console.log("Error: Contraseña incorrecta");
            return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        // Crear y firmar el JWT
        const token = jwt.sign({ id: empleado._id, rol: empleado.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Login exitoso, token generado:", token);  // Verificar token generado
        res.json({ mensaje: "Login exitoso", token });
    } catch (err) {
        console.error("❌ Error al iniciar sesión:", err);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

module.exports = router;
