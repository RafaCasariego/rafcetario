import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearReceta } from "../services/api";

const CrearReceta = () => {
  const navigate = useNavigate();
  const [receta, setReceta] = useState({
    nombre: "",
    descripcion: "",
    ingredientes: "",
    instrucciones: "",
    tiempo_minutos: "",
  });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]); // Guardar la imagen seleccionada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await crearReceta({ ...receta, tiempo_minutos: Number(receta.tiempo_minutos), imagen }); // 🔥 Asegurar que el número se envía correctamente
      navigate("/mis-recetas"); // Redirige después de crear la receta
    } catch {
      setError("Error al crear la receta.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Crear Nueva Receta</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          value={receta.nombre}
          onChange={handleChange}
          placeholder="Nombre de la receta"
          className="p-2 border rounded-lg"
          required
        />
        <textarea
          name="descripcion"
          value={receta.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="p-2 border rounded-lg"
          required
        />
        <textarea
          name="ingredientes"
          value={receta.ingredientes}
          onChange={handleChange}
          placeholder="Ingredientes"
          className="p-2 border rounded-lg"
          required
        />
        <textarea
          name="instrucciones"
          value={receta.instrucciones}
          onChange={handleChange}
          placeholder="Instrucciones"
          className="p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          name="tiempo_minutos"
          value={receta.tiempo_minutos}
          onChange={handleChange}
          placeholder="Tiempo en minutos"
          className="p-2 border rounded-lg"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded-lg"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
          Crear Receta
        </button>
      </form>
    </div>
  );
};

export default CrearReceta;

