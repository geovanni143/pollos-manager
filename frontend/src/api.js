import axios from "axios";

// Crear instancia de axios
const api = axios.create({
    baseURL: "http://localhost:5000" // Cambia esto si es necesario
});

// Agregar el token de autenticación a todas las solicitudes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");  // Asumimos que guardas el token en localStorage
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return config;
});

export default api;

