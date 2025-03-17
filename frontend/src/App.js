import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas"; // 🔹 Importamos la nueva página de ventas

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/productos" element={<Productos />} />
                <Route path="/ventas" element={<Ventas />} /> {/* 🔹 Nueva ruta para ver las ventas */}
            </Routes>
        </Router>
    );
}

export default App;
