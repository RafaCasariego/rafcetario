import { useState, useEffect } from "react";
import { obtenerMisRecetas, eliminarReceta } from "../services/api";
import { Link } from "react-router-dom";

const MisRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Obtener usuario_id desde localStorage
  const usuario_id = localStorage.getItem("usuario_id");

  useEffect(() => {
    if (usuario_id) {
      obtenerMisRecetas(usuario_id)
        .then((data) => setRecetas(data))
        .catch(() => setMensaje("No se pudieron cargar las recetas."));
    }
  }, [usuario_id]);

  // Eliminar receta
  const handleEliminar = async (recetaId) => {
    try {
      await eliminarReceta(recetaId);
      setRecetas(recetas.filter((receta) => receta.id !== recetaId));
      setMensaje("Receta eliminada correctamente.");
    } catch (error) {
      setMensaje("Error al eliminar la receta.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Recetas</h1>
        <Link
          to="/receta/crear-receta"
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          + Nueva Receta
        </Link>
      </div>

      {/* Mensajes */}
      {mensaje && <p className="text-red-500 text-center">{mensaje}</p>}

      {/* Lista de recetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recetas.length > 0 ? (
          recetas.map((receta) => (
            <div
              key={receta.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-700">{receta.nombre}</h3>
              <div className="flex justify-between mt-3">
                <Link to={`/receta/${receta.id}`} className="text-blue-500 hover:underline">
                  Ver
                </Link>
                <Link to={`/receta/editar/${receta.id}`} className="text-blue-500 hover:underline">
                  Editar
                </Link>

                <button
                  onClick={() => handleEliminar(receta.id)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No tienes recetas creadas.</p>
        )}
      </div>
    </div>
  );
};

export default MisRecetas;
