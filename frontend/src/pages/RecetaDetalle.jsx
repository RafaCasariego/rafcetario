import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { obtenerRecetaPorId } from "../services/api";

const RecetaDetalle = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [receta, setReceta] = useState(null);
  const [error, setError] = useState("");
  const [like, setLike] = useState(false);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    obtenerRecetaPorId(id)
      .then((data) => setReceta(data))
      .catch(() => setError("No se pudo cargar la receta."));
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>;
  }

  if (!receta) {
    return <p className="text-center text-gray-600 mt-20">Cargando receta...</p>;
  }

  const handleLike = () => {
    // Lógica para el like (llamada a API, etc.)
    setLike(!like);
  };

  const handleFavorito = () => {
    // Lógica para agregar o quitar de favoritos
    setFavorito(!favorito);
  };

  return (
    <div className="pt-24 pb-10 px-6">
      <div className="max-w-3xl mx-auto bg-neutral-200 shadow-lg rounded-lg p-10">
        {/* Título y Descripción */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{receta.nombre}</h1>
          <p className="text-black text-lg">{receta.descripcion}</p>
        </div>

        {/* Imagen de la receta */}
        <div className="mb-8">
          <img
            src={
              receta.imagen_url ||
              "https://rafcetario-images.s3.eu-north-1.amazonaws.com/default-image.jpg"
            }
            alt={receta.nombre}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Ingredientes */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredientes:</h2>
          <p className="text-black whitespace-pre-line text-lg">
            {receta.ingredientes}
          </p>
        </div>

        {/* Instrucciones */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instrucciones:</h2>
          <p className="text-black whitespace-pre-line text-lg">
            {receta.instrucciones}
          </p>
        </div>

        {/* Botones de Like y Favorito */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            {like ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.656l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span>Liked</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.656l-6.828-6.829a4 4 0 010-5.656z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Like</span>
              </>
            )}
          </button>

          <button
            onClick={handleFavorito}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            {favorito ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecetaDetalle;
