import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Navbar
import Navbar from "./components/Navbar";

// Páginas
import Login from "./pages/Login";
import Proveedores from "./pages/Proveedores";
import Productos from "./pages/Productos";
import HistorialCompras from "./pages/HistorialCompras";
import Ventas from "./pages/Ventas";
import RegistrarEmpleado from "./pages/RegistrarEmpleado";
import Puestos from "./pages/Puestos";
import Gastos from "./pages/Gastos";
import Inventario from "./pages/Inventario";
import ReporteGanancias from "./pages/ReporteGanancias";
import VincularPin from "./pages/VincularPin";
import InicioDashboard from "./pages/InicioDashboard";
import Perfil from "./pages/Perfil";
import LoginAdmin from "./pages/LoginAdmin";


function AppContent() {
  const location = useLocation();
  const [mostrarNavbar, setMostrarNavbar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const idDueño = localStorage.getItem("idDueño");

    // Mostrar navbar solo si está logueado y tiene rol de dueño o está vinculado con un dueño
    const puedeVerNavbar = !!token && (rol === "dueño" || idDueño);
    setMostrarNavbar(puedeVerNavbar);
  }, [location]);

  return (
    <div className="md:flex">
      {mostrarNavbar &&
        location.pathname !== "/login" &&
        location.pathname !== "/login-admin" && <Navbar />}
      <div className="flex-1 p-4 pb-20 md:pb-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<InicioDashboard />} />
          <Route path="/vincular-pin" element={<VincularPin />} />
          <Route path="/reporte-ganancias" element={<ReporteGanancias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/empleados" element={<RegistrarEmpleado />} />
          <Route path="/puestos" element={<Puestos />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/reportes" element={<ReporteGanancias />} />
          <Route path="/compras/:id" element={<HistorialCompras />} />
          <Route path="/proveedores" element={<Proveedores />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
