import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Recetas from "./pages/Recetas";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaPrivada from "./components/RutaPrivada";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        <Route path="/" element={<Inicio />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route element={<RutaPrivada />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
