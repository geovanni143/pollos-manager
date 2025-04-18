const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const puestosRoutes = require("./routes/puestos");
const reportesRoutes = require("./routes/reportes");
const gastosRoutes = require("./routes/gastos");
const dashboardRoutes = require("./routes/dashboard");
const rutaCompras = require("./routes/compras");
require("dotenv").config();

// Importar rutas de empleados
const empleadosRoutes = require("./routes/empleados");

const app = express();

app.use(express.json());
app.use(cors());

// Conectar con MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error en MongoDB:", err));

// Asegúrate de usar la ruta correcta
app.use("/empleados", empleadosRoutes); // Conecta correctamente la ruta de empleados

// Rutas para productos y ventas
app.use("/proveedores", require("./routes/proveedores"));

app.use("/productos", require("./routes/productos"));
app.use("/dashboard", dashboardRoutes);
app.use("/compras", rutaCompras);
app.use("/ventas", require("./routes/ventas"));
app.use("/puestos", require("./routes/puestos"));
app.use("/gastos", gastosRoutes);
app.use("/reportes", reportesRoutes);
app.use("/movimientos-stock", require("./routes/movimientos-stock"));


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});


