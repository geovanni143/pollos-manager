import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productos from "./pages/Productos";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/productos" element={<Productos />} />
            </Routes>
        </Router>
    );
}

export default App;
