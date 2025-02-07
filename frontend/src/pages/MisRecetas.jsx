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
    <div className="p-6 mt-16">
      {/* Tarjeta principal */}
      <div className="max-w-4xl mx-auto bg-transparent p-10">
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
        {mensaje && <p className="text-red-500 text-center mb-4">{mensaje}</p>}

        {/* Listado de recetas */}
        <div className="flex flex-col gap-6">
          {recetas.length > 0 ? (
            recetas.map((receta) => (
              <div
                key={receta.id}
                className="bg-neutral-200 shadow-md rounded-lg p-4 border border-gray-500 flex items-center"
              >
                {/* Imagen con mayor tamaño */}
                <img
                  src={
                    receta.imagen_url ||
                    "https://rafcetario-images.s3.eu-north-1.amazonaws.com/default-image.jpg"
                  }
                  alt={receta.nombre}
                  className="w-32 h-32 rounded object-cover"
                />
                {/* Título de la receta */}
                <div className="flex-1 ml-4">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {receta.nombre}
                  </h3>
                </div>
                {/* Botones para ver, editar y eliminar */}
                <div className="flex gap-2">
                  <Link
                    to={`/receta/${receta.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/receta/editar/${receta.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(receta.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No tienes recetas creadas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisRecetas;
