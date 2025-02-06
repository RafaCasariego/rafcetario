import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerRecetas } from "../services/api";

// Función para normalizar texto (elimina tildes y caracteres especiales)
const normalizarTexto = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const Inicio = () => {
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalReceta, setModalReceta] = useState(null);
  const recetasPorPagina = 12; 
  const gridRef = useRef(null);
  const navigate = useNavigate();
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const verificarAutenticacion = () => {
      const token = localStorage.getItem("token");
      setUsuarioAutenticado(!!token);
    };
    verificarAutenticacion();
    window.addEventListener("storage", verificarAutenticacion);
    return () => window.removeEventListener("storage", verificarAutenticacion);
  }, []);

  // Obtener todas las recetas 
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const data = await obtenerRecetas();
        if (data && data.length > 0) {
          setRecetas(data);
          setError(null);
        } else {
          setRecetas([]);
          setError("No hay recetas disponibles en este momento.");
        }
      } catch (err) {
        setRecetas([]);
        setError("Error cargando recetas.");
      }
    };
    fetchRecetas();
  }, []);

  // Reiniciamos la página a 1 cuando cambia el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  // Filtrar las recetas según el filtro (buscando en nombre o ingredientes)
  const recetasFiltradas = recetas.filter((receta) =>
    normalizarTexto(receta.nombre).includes(normalizarTexto(filtro)) ||
    normalizarTexto(receta.ingredientes).includes(normalizarTexto(filtro))
  );

  // Calcular total de páginas y obtener el slice de recetas a mostrar
  const totalPaginas = Math.ceil(recetasFiltradas.length / recetasPorPagina);
  const indiceInicio = (paginaActual - 1) * recetasPorPagina;
  const recetasPaginadas = recetasFiltradas.slice(
    indiceInicio,
    indiceInicio + recetasPorPagina
  );

  const handleBuscar = () => {
    setPaginaActual(1);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Cerrar el modal al hacer clic fuera
  const handleCerrarModal = (e) => {
    if (e.target.id === "modalFondo") {
      setModalReceta(null);
    }
  };

  // Función para generar los elementos de paginación con números y elipses
  const getPaginationItems = () => {
    const pages = [];
    if (totalPaginas <= 1) return pages;
    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) {
        pages.push(i);
      }
      return pages;
    }
    if (paginaActual === 1) {
      pages.push(1, 2, 3, 4, "ellipsis", totalPaginas);
    } else if (paginaActual === totalPaginas) {
      pages.push(1, "ellipsis", totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas);
    } else {
      const blockSize = 4;
      let block = [];
      if (paginaActual <= totalPaginas - blockSize) {
        for (let i = paginaActual; i < paginaActual + blockSize; i++) {
          block.push(i);
        }
      } else {
        for (let i = totalPaginas - blockSize; i < totalPaginas; i++) {
          block.push(i);
        }
      }
      if (block[0] === 2) {
        pages.push(1, ...block);
      } else {
        pages.push(1, "ellipsis", ...block);
      }
      if (block[block.length - 1] < totalPaginas - 1) {
        pages.push("ellipsis", totalPaginas);
      } else {
        pages.push(totalPaginas);
      }
    }
    return pages;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: "url('/images/2148678341.jpg')" }}
      >
        <h1 className="text-5xl font-bold text-center">
          ¡Bienvenido al <span className="text-yellow-500">Rafcetario!</span>
        </h1>
        <p className="mt-4 text-lg">Un montón de recetas por explorar :)</p>
        {/* Barra de búsqueda en el hero */}
        <div className="mt-6 flex items-center bg-gray-300 rounded-full px-4 py-2 w-1/2">
          <input
            type="text"
            placeholder="🔍 Ingredientes, recetas..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
            className="w-full p-2 bg-gray-300 text-gray-700 rounded-full focus:outline-none"
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-500 px-4 py-2 ml-2 rounded-full text-white font-semibold hover:bg-green-600"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Sección de Recetas */}
      <div className="py-12 px-6 max-w-7xl mx-auto" ref={gridRef}>
        {/* Título original */}
        <h2 className="text-3xl font-bold mb-6 text-center">Explora Nuestras Recetas :)</h2>

        {/* Buscador interno (más ancho) */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Buscar en recetas..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-[95%] p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Grid de recetas con diseño minimalista */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recetasPaginadas.length > 0 ? (
            recetasPaginadas.map((receta) => (
              <div
                key={receta.id}
                className="bg-gray-300 drop-shadow-md rounded-lg overflow-hidden transform transition hover:scale-105 cursor-pointer"
                onClick={() => setModalReceta(receta)}
              >
                <img
                  src={
                    receta.imagen_url ||
                    "https://rafcetario-images.s3.eu-north-1.amazonaws.com/default-image.jpg"
                  }
                  alt={receta.nombre}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{receta.nombre}</h3>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                    {receta.descripcion}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      {receta.tiempo_minutos} min
                    </span>
                    <span className="flex items-center text-gray-500 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.656l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      {receta.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No hay recetas disponibles.</p>
          )}
        </div>

        {/* Paginación con listado de páginas */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              {"<"}
            </button>
            {getPaginationItems().map((item, index) =>
              item === "ellipsis" ? (
                <span key={index} className="px-3 py-1 mx-1">
                  …
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => setPaginaActual(item)}
                  className={`px-3 py-1 mx-1 rounded ${
                    item === paginaActual
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              {">"}
            </button>
          </div>
        )}
      </div>

      {/* Modal de Receta */}
      {modalReceta && (
        <div
          id="modalFondo"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCerrarModal}
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalReceta(null)}
            >
              ✖
            </button>
            <img
              src={
                modalReceta.imagen_url ||
                "https://rafcetario-images.s3.eu-north-1.amazonaws.com/default-image.jpg"
              }
              alt={modalReceta.nombre}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold">{modalReceta.nombre}</h3>
            <p className="text-gray-600 mt-2">{modalReceta.descripcion}</p>
            <p className="text-gray-500 mt-2">
              🥕 Ingredientes: {modalReceta.ingredientes}
            </p>
            <p className="text-gray-500 mt-2">
              📜 Instrucciones: {modalReceta.instrucciones}
            </p>
            <p className="text-gray-500 mt-2">
              ⏳ {modalReceta.tiempo_minutos} min
            </p>
          </div>
        </div>
      )}

      {/* CTA Dinámico */}
      <div className="py-20 bg-gray-300 px-6 text-center">
        {usuarioAutenticado ? (
          <>
            <h2 className="text-2xl font-bold mb-4 py-3">
              Añade una de tus recetas a nuestra comunidad!
            </h2>
            <p className="text-lg text-gray-800 font-semibold mb-4 py-3">
              Si añades tus recetas, todo el mundo podrá verlas y compartirlas.
            </p>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600"
              onClick={() => navigate("/receta/crear-receta")}
            >
              Crear Receta
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Regístrate para añadir recetas a favoritos, crear tus propias recetas y más!
            </h2>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600"
              onClick={() => navigate("/registro")}
            >
              Registrarme
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Inicio;
