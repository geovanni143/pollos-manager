import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas"; // 🔹 Aqui se importa la nueva página de ventas
import RegistrarEmpleado from "./pages/RegistrarEmpleado";  
import Login from "./pages/Login";
import Puestos from "./pages/Puestos";
import Gastos from "./pages/Gastos"; 
import Inventario from "./pages/Inventario";
import ReporteGanancias from "./pages/ReporteGanancias";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />{" "}
        <Route path="/empleados" element={<RegistrarEmpleado />} />
        <Route path="/login" element={<Login />} />
        {/* 🔹 La nueva ruta para ver las ventas */}
        <Route path="/" element={<Login />} />
        <Route path="/puestos" element={<Puestos />} />
        <Route path="/gastos" element={<Gastos />} /> 
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/reporte-ganancias" element={<ReporteGanancias />} />
        {/* Luego agregamos login-admin, empleados, productos, ventas */}
      </Routes>
    </Router>
  );
}

export default App;
