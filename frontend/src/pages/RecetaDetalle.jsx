import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerRecetaPorId } from "../services/api";

const RecetaDetalle = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [receta, setReceta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerRecetaPorId(id)
      .then((data) => setReceta(data))
      .catch(() => setError("No se pudo cargar la receta."));
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!receta) {
    return <p className="text-center text-gray-600">Cargando receta...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{receta.nombre}</h1>
      <p className="text-gray-700 mb-4">{receta.descripcion}</p>

      <h2 className="text-xl font-semibold mt-6">Ingredientes:</h2>
      <p className="text-gray-600">{receta.ingredientes}</p>

      <h2 className="text-xl font-semibold mt-6">Instrucciones:</h2>
      <p className="text-gray-600">{receta.instrucciones}</p>

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Volver
      </Link>
    </div>
  );
};

export default RecetaDetalle;
