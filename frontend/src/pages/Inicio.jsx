import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerRecetas } from "../services/api";

const Inicio = () => {
  const [recetas, setRecetas] = useState([]); // 🔹 Recetas destacadas
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const data = await obtenerRecetas();
        if (data && data.length > 0) {
          setRecetas(data.slice(0, 9)); // 🔹 Tomamos solo las 9 primeras recetas destacadas
        } else {
          setRecetas([]);
          setError("No hay recetas destacadas en este momento.");
        }
      } catch (err) {
        setRecetas([]);
        setError("Error cargando recetas.");
      }
    };

    fetchRecetas();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: "url('public/images/2148678341.jpg')" }}
      >
        <h1 className="text-5xl font-bold text-center">
          ¡Bienvenido al <span className="text-yellow-500">Rafcetario!</span>
        </h1>
        <p className="mt-4 text-lg">Un montón de recetas por explorar :)</p>

        <div className="mt-6 flex items-center bg-gray-300 rounded-full px-4 py-2 w-1/2">
          <input
            type="text"
            placeholder="🔍 Ingredientes, recetas..."
            className="w-full p-2 bg-gray-300 text-gray-700 rounded-full focus:outline-none"
          />
          <button className="bg-blue-500 px-4 py-2 rounded-full text-white font-semibold hover:bg-green-600">
            Buscar
          </button>
        </div>
      </div>

      {/* Recetas Destacadas */}
      <div className="py-12 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Recetas Destacadas</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recetas.length > 0 ? (
            recetas.map((receta) => (
              <div key={receta.id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition">
                <img
                  src={receta.imagen || "/images/default-recipe.jpg"}
                  alt={receta.nombre}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-2">{receta.nombre}</h3>
                <p className="text-gray-600">{receta.descripcion}</p>
                <p className="text-gray-500 mt-2">⏳ {receta.tiempo_minutos} min</p>
                <div className="flex justify-between items-center mt-4">
                  <Link to={`/receta/${receta.id}`} className="text-blue-500 hover:underline">
                    Ver receta
                  </Link>
                  <span>❤️ {receta.likes || 0}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No hay recetas destacadas disponibles.</p>
          )}
        </div>
      </div>

      {/* CTA Dinámico */}
      <div className="py-12 bg-gray-100 px-6 text-center">
        {token ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Aporta una nueva receta a la comunidad!</h2>
            <p className="text-gray-600 mb-4">Estamos deseando conocer tus dotes culinarias :)</p>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600"
              onClick={() => navigate("/receta/crear-receta")}
            >
              Crear Receta
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Regístrate para crear tus recetas!</h2>
            <p className="text-gray-600 mb-4">
              Así podrás guardar tus recetas en favoritos, crear otras nuevas o editar las antiguas!
            </p>
            <Link to="/registro">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600">
                Registrarme
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>© 2025 Rafcetario - Todas las recetas en un solo lugar 🍽️</p>
      </footer>
    </div>
  );
};

export default Inicio;

