import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerPerfil } from "../services/api";
import { FaUser } from "react-icons/fa"; // Icono de usuario

const Navbar = () => {
  const [usuario, setUsuario] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation(); // Detecta en qué página estamos

  useEffect(() => {
    if (location.pathname !== "/") {
      // Si no estamos en Inicio, el navbar siempre es visible
      setScrolling(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.reload(); // Para actualizar el estado en la UI
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-4 transition-all duration-300 z-50 ${
        scrolling ? "bg-blue-600 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">
          Rafcetario
        </Link>
        <div>
          {usuario ? (
            <>
              <span className="mr-4">
                <Link to="/perfil" className="text-white">
                  Bienvenido, {usuario.nombre}!
                </Link>
              </span>
              <Link to="/favoritos" className="mr-4 hover:underline text-white">
                Favoritos
              </Link>
              <Link to="/mis-recetas" className="mr-4 hover:underline text-white">
                Mis Recetas
              </Link>
              <button
                onClick={cerrarSesion}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-white hover:opacity-80 transition"
            >
              <FaUser className="text-3xl" /> {/* Solo el icono */}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
