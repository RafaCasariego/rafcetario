import { useState, useEffect } from "react";
import { obtenerFavoritos } from "../services/api"; // Función para obtener favoritos

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerFavoritos(token).then((data) => setFavoritos(data));
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Recetas Favoritas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoritos.length > 0 ? (
          favoritos.map((receta) => (
            <div key={receta.id} className="border p-4 rounded-lg">
              <h3 className="text-xl">{receta.nombre}</h3>
              <p>{receta.descripcion}</p>
            </div>
          ))
        ) : (
          <p>No tienes recetas favoritas.</p>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
