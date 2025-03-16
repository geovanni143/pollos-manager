const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.log("❌ Error en MongoDB:", err));


const productosRoutes = require("./routes/productos");
app.use("/productos", require("./routes/productos"));
app.use("/ventas", require("./routes/ventas"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
