import { useState, useEffect } from "react";
import { obtenerMisRecetas, crearReceta } from "../services/api";

const MisRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [nuevaReceta, setNuevaReceta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usuario_id = localStorage.getItem("usuario_id");

    if (usuario_id) {
      obtenerMisRecetas(usuario_id)
        .then((data) => {
          setRecetas(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error obteniendo recetas:", err);
          setError("No se pudieron cargar las recetas.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No se encontró el usuario.");
    }
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado.");
      return;
    }

    crearReceta({ nombre: nuevaReceta }, token)
      .then((recetaCreada) => {
        setRecetas([...recetas, recetaCreada]);
        setNuevaReceta("");
      })
      .catch((err) => {
        console.error("Error creando receta:", err);
        setError("No se pudo crear la receta.");
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Mis Recetas</h1>

      {/* Formulario para crear receta */}
      <form onSubmit={handleCreate} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nombre de la receta"
          value={nuevaReceta}
          onChange={(e) => setNuevaReceta(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Crear receta
        </button>
      </form>

      {/* Mostrar estado de carga */}
      {loading && <p className="text-gray-600">Cargando recetas...</p>}

      {/* Mostrar error si ocurre */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Mostrar recetas */}
      <div>
        {recetas.length > 0 ? (
          recetas.map((receta) => (
            <div key={receta.id} className="border p-4 rounded-lg shadow-md bg-white mb-2">
              <h3 className="text-lg font-semibold">{receta.nombre}</h3>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-500">No tienes recetas creadas.</p>
        )}
      </div>
    </div>
  );
};

export default MisRecetas;
