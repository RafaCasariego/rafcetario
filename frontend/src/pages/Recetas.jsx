import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerRecetas } from "../services/api";

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // 10 recetas por llamada
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        // Se solicita la página actual con el límite deseado
        const data = await obtenerRecetas(page, limit);
        if (data && data.length > 0) {
          setRecetas(prev => [...prev, ...data]);
          if (data.length < limit) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error al cargar recetas:", error);
        setHasMore(false);
      }
    };

    fetchRecetas();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;
      // Cuando se llega cerca del final de la página (100px de margen)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  // Filtrado simple de recetas según el texto del buscador
  const filteredRecetas = filter
    ? recetas.filter(receta =>
        receta.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        receta.descripcion.toLowerCase().includes(filter.toLowerCase())
      )
    : recetas;

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Encabezado con título y buscador */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Todas nuestras recetas
        </h1>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar recetas..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Lista de recetas con márgenes laterales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecetas.map((receta) => (
          <div
            key={receta.id}
            className="p-4 border rounded-lg shadow-md flex flex-col"
          >
            <img
              src={
                receta.imagen_url ||
                "https://rafcetario-images.s3.eu-north-1.amazonaws.com/default-image.jpg"
              }
              alt={receta.nombre}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {receta.nombre}
            </h2>
            <p className="text-gray-600 flex-1">{receta.descripcion}</p>
            <Link
              to={`/receta/${receta.id}`}
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition self-start"
            >
              Ver Receta
            </Link>
          </div>
        ))}
      </div>

      {/* Mensaje de carga si hay más recetas */}
      {hasMore && (
        <p className="text-center mt-6 text-gray-600">
          Cargando más recetas...
        </p>
      )}
    </div>
  );
}

export default Recetas;
