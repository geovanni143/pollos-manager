import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const enlace = (ruta, label, icono) => (
    <li key={ruta}>
      <Link
        to={ruta}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          location.pathname === ruta
            ? "bg-yellow-100 text-yellow-600 font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="text-xl">{icono}</span>
        <span>{label}</span>
      </Link>
    </li>
  );

  const enlacesPerfil = [enlace("/perfil", "Mi Perfil", "🙍‍♂️")];

  const enlacesGenerales = [
    enlace("/inventario", "Notificaciones", "🔔"),
    enlace("/dashboard", "Resumen Diario", "📅"),
    enlace("/ventas", "Ventas", "🛒"),
    enlace("/productos", "Productos", "📦"),
    enlace("/puestos", "Puestos", "🏪"),
  ];

  const enlacesDueño = rol === "dueño" ? [
    enlace("/mis-empleados", "Mis Empleados", "👥"),
    enlace("/reportes", "Reportes", "📈"),
    enlace("/inventario", "Inventario", "📊"),
    enlace("/gastos", "Gastos", "💸"),
    enlace("/proveedores", "Proveedores", "🧾"),
  ] : [];

  const enlacesExtras = rol === "dueño" ? [
    enlace("/configuracion", "Configuración", "⚙️"),
    enlace("/ayuda", "Centro de Ayuda", "🧠"),
  ] : [];

  return (
    <nav className="w-full md:w-60 h-auto md:h-screen bg-white shadow-md border-r p-4 flex flex-col justify-between fixed md:static z-50">
      {/* Perfil siempre arriba */}
      <ul className="mb-6">
        {enlacesPerfil}
      </ul>

      {/* Enlaces principales */}
      <ul className="flex-1 space-y-1 overflow-y-auto">
        {enlacesGenerales}
        {enlacesDueño}
        {enlacesExtras}
      </ul>
      {/* Cerrar sesión */}
      <ul className="mt-4 border-t pt-4">
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
          >
            <span className="text-xl">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
