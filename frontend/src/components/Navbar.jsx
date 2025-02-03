import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerPerfil } from "../services/api";

const Navbar = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerPerfil(token).then((data) => setUsuario(data));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Rafcetario</Link>
      <div>
        {usuario ? (
          <>
            <span className="mr-4">
              <Link to="/perfil" className="text-white">Bienvenido, {usuario.nombre}!</Link>
            </span>
            <Link to="/favoritos" className="mr-4 hover:underline text-white">Favoritos</Link>
            <Link to="/mis-recetas" className="mr-4 hover:underline text-white">Mis Recetas</Link>
            <button onClick={cerrarSesion} className="bg-white text-blue-600 px-4 py-2 rounded-lg">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline bg-white text-blue-600 px-4 py-2 rounded-lg">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
