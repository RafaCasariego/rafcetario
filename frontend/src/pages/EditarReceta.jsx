import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerRecetaPorId, actualizarReceta } from "../services/api";

const EditarReceta = () => {
  const { id } = useParams(); // Obtiene el ID de la receta desde la URL
  const navigate = useNavigate(); // Para redirigir después de guardar
  const [receta, setReceta] = useState({
    nombre: "",
    descripcion: "",
    ingredientes: "",
    instrucciones: "",
    tiempo_minutos: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerRecetaPorId(id)
      .then((data) => setReceta(data))
      .catch(() => setError("No se pudo cargar la receta."));
  }, [id]);

  const handleChange = (e) => {
    setReceta({ ...receta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarReceta(id, receta);
      navigate("/mis-recetas"); // Redirige a Mis Recetas después de editar
    } catch {
      setError("Error al actualizar la receta.");
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Editar Receta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          value={receta.nombre}
          onChange={handleChange}
          placeholder="Nombre de la receta"
          className="p-2 border rounded-lg"
        />
        <textarea
          name="descripcion"
          value={receta.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="p-2 border rounded-lg"
        />
        <textarea
          name="ingredientes"
          value={receta.ingredientes}
          onChange={handleChange}
          placeholder="Ingredientes"
          className="p-2 border rounded-lg"
        />
        <textarea
          name="instrucciones"
          value={receta.instrucciones}
          onChange={handleChange}
          placeholder="Instrucciones"
          className="p-2 border rounded-lg"
        />
        <input
          type="number"
          name="tiempo_minutos"
          value={receta.tiempo_minutos}
          onChange={handleChange}
          placeholder="Tiempo en minutos"
          className="p-2 border rounded-lg"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditarReceta;
