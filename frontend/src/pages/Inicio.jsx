import { useState, useEffect } from "react";
import { obtenerRecetas } from "../services/api";
import { Link } from "react-router-dom";

const Inicio = () => {
  const [recetas, setRecetas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecetas, setFilteredRecetas] = useState([]);

  useEffect(() => {
    obtenerRecetas().then((data) => {
      console.log("Datos obtenidos:", data); // Verifica la estructura de la respuesta
      setRecetas(data); // Asumiendo que data es un array de recetas
    });
  }, []);
  

  useEffect(() => {
    if (searchQuery) {
      setFilteredRecetas(
        recetas.filter(
          (receta) =>
            receta.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            receta.ingredientes.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRecetas(recetas);
    }
  }, [searchQuery, recetas]);

  return (
    <div className="p-4">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">Bienvenido a Rafcetario</h1>
        <p className="text-lg">Encuentra y comparte tus mejores recetas.</p>
      </header>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Busca recetas por nombre o ingredientes"
          className="p-2 border rounded-lg w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section>
        <h2 className="text-3xl font-bold mb-4">Recetas Destacadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecetas.length > 0 ? (
            filteredRecetas.map((receta) => (
              <div key={receta.id} className="border p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{receta.nombre}</h3>
                <p>{receta.descripcion}</p>
                <Link to={`/receta/${receta.id}`} className="text-blue-500 hover:underline">
                  Ver receta
                </Link>
              </div>
            ))
          ) : (
            <p>No se encontraron recetas.</p>
          )}
        </div>
      </section>

      {/* CTA para usuarios no logueados */}
      <div className="mt-6 text-center">
        {!localStorage.getItem("token") && (
          <p>
            ¿Aún no tienes cuenta?{" "}
            <Link to="/registro" className="text-blue-500 hover:underline">
              Regístrate para compartir tus recetas
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Inicio;
