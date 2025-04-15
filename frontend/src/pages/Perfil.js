import React, { useEffect, useState } from "react";

function Perfil() {
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    rol: ""
  });

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    const correo = localStorage.getItem("correo");
    const rol = localStorage.getItem("rol");

    console.log("Datos de sesión:", { nombre, correo, rol });

    setDatos({ nombre, correo, rol });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-purple-700 text-3xl">👤</span> Mi Perfil
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md border">
        <p className="mb-2"><strong>Nombre:</strong> {datos.nombre}</p>
        <p className="mb-2"><strong>Correo:</strong> {datos.correo}</p>
        <p className="mb-2"><strong>Rol:</strong> {datos.rol === "dueño" ? "Administrador" : "Empleado"}</p>
      </div>
    </div>
  );
}

export default Perfil;
