const jwt = require("jsonwebtoken");

const verificarJWT = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ mensaje: "No se ha proporcionado un token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.empleado = decoded;  // Guardar los datos decodificados
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: "Token no válido" });
    }
};

const verificarAdmin = (req, res, next) => {
    if (req.empleado.rol !== "dueño") {
        return res.status(403).json({ mensaje: "Acceso denegado, solo los administradores pueden realizar esta acción" });
    }
    next();
};

module.exports = { verificarJWT, verificarAdmin };
