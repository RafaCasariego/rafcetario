import { useState, useEffect } from "react";
import { obtenerPerfil, actualizarUsuario } from "../services/api"; // Funciones para obtener y actualizar perfil

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerPerfil(token).then((data) => setUsuario(data));
    }
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Lógica para actualizar usuario
    actualizarUsuario(usuario).then(() => {
      alert("Perfil actualizado");
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
      {usuario ? (
        <>
          <p>Nombre: {usuario.nombre}</p>
          <p>Email: {usuario.email}</p>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={usuario.nombre}
              onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
            />
            <button type="submit">Actualizar</button>
          </form>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Perfil;
