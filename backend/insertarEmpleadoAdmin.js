const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Empleado = require("./models/Empleado"); // Asegúrate de que esta ruta esté bien
require("dotenv").config(); // Para usar MONGO_URI

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const passwordEncriptado = await bcrypt.hash("admin123", 10);

    const nuevoEmpleado = new Empleado({
      nombre: "Admin Master",
      rol: "dueño",
      contacto: {
        correo: "admin@negocio.com",
        telefono: "1234567890"
      },
      password: passwordEncriptado
    });

    await nuevoEmpleado.save();
    console.log("✅ Empleado administrador creado con éxito");
    mongoose.disconnect();
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));
