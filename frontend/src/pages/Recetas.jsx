import { useEffect, useState } from "react";
import { obtenerRecetas } from "../services/api";

function Recetas() {
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    const fetchRecetas = async () => {
      const data = await obtenerRecetas();
      setRecetas(data);
    };

    fetchRecetas();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center text-blue-500">Recetas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {recetas.map((receta) => (
          <div key={receta.id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{receta.nombre}</h2>
            <p className="text-gray-600">{receta.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recetas;
