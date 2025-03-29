import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

// Páginas principales
import Login from "./pages/Login";
import Proveedores from "./pages/Proveedores";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import HistorialCompras from "./pages/HistorialCompras";
import Ventas from "./pages/Ventas";
import RegistrarEmpleado from "./pages/RegistrarEmpleado";
import Puestos from "./pages/Puestos";
import Gastos from "./pages/Gastos";
import Inventario from "./pages/Inventario";
import ReporteGanancias from "./pages/ReporteGanancias";
import InicioDashboard from "./pages/InicioDashboard"; 
function App() {
  return (
    <Router>
      <div className="md:flex">
        <Navbar />
        <div className="flex-1 p-4 pb-20 md:pb-4">
          <Routes>
            {/* Rutas protegidas o internas del sistema */}
            <Route path="/dashboard" element={<InicioDashboard />} />
            <Route path="/reporte-ganancias" element={<ReporteGanancias />} />
 
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/empleados" element={<RegistrarEmpleado />} />
            <Route path="/puestos" element={<Puestos />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/reportes" element={<ReporteGanancias />} />

            {/* Login por separado */}
            <Route path="/login" element={<Login />} />
            <Route path="/compras/:id" element={<HistorialCompras />} />
            
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
