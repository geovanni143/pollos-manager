import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const rol = localStorage.getItem("rol");

    // Enlaces base que todos pueden ver
    const enlacesGenerales = [
        { ruta: "/dashboard", label: "Inicio", icono: "🏠" },
        { ruta: "/ventas", label: "Ventas", icono: "🛒" },
        { ruta: "/productos", label: "Productos", icono: "📦" },
    ];

    // Solo el dueño puede ver estos
    const enlacesDueño = [
        { ruta: "/empleados", label: "Empleados", icono: "👥" },
        { ruta: "/reportes", label: "Reportes", icono: "📈" },
        { ruta: "/inventario", label: "Inventario", icono: "📊" },
        { ruta: "/gastos", label: "Gastos", icono: "💸" },
        { ruta: "/proveedores", label: "Proveedores", icono: "🧾" },
    ];

    const handleLogout = () => {
        localStorage.clear(); // Borra token y rol
        navigate("/login");
    };

    const enlaces = [
        ...enlacesGenerales,
        ...(rol === "dueño" ? enlacesDueño : []),
    ];

    return (
        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-md z-50 md:static md:w-auto md:h-screen md:border-r md:border-t-0">
            <ul className="flex md:flex-col justify-between md:justify-start p-2 md:p-4 gap-2 md:gap-4 overflow-x-auto md:overflow-visible">
                {enlaces.map((item, i) => (
                    <li key={i}>
                        <Link
                            to={item.ruta}
                            className={`flex flex-col items-center md:flex-row md:gap-2 text-sm px-3 py-2 rounded-md 
                                ${location.pathname === item.ruta
                                    ? "bg-yellow-100 text-yellow-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <span className="text-xl">{item.icono}</span>
                            <span className="hidden md:inline">{item.label}</span>
                        </Link>
                    </li>
                ))}

                {/* Cerrar sesión */}
                <li>
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center md:flex-row md:gap-2 text-sm px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <span className="text-xl">🚪</span>
                        <span className="hidden md:inline">Cerrar sesión</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
