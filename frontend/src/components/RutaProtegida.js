import { Navigate } from "react-router-dom";

function RutaProtegida({ children, permitido }) {
  const rol = localStorage.getItem("rol");

  if (!rol) return <Navigate to="/login" />;

  if (permitido.includes(rol)) {
    return children;
  }

  return <Navigate to="/ventas" />;
}

export default RutaProtegida;
