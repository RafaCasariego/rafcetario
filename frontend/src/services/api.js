import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Cambia esto si tu backend está en otro puerto

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


//---------> FUNCIONES DE LAS RECETAS <----------

// Obtener todas las recetas
export const obtenerRecetas = async () => {
  const response = await api.get("/recetas");
  return response.data;
};


// Obtener las recetas creadas por un usuario autenticado N
export const obtenerMisRecetas = async (usuario_id) => {
  const response = await api.get(`/recetas/usuarios/${usuario_id}`);
  return response.data;
}


// Eliminar receta por ID
export const eliminarReceta = async (recetaId) => {
  const response = await api.delete(`/recetas/${recetaId}`);
  return response.data;
};


// Obtener los detalles de una receta por ID
export const obtenerRecetaPorId = async (receta_id) => {
  const response = await api.get(`/recetas/${receta_id}`);
  return response.data;
};


// Actualizar una receta
export const actualizarReceta = async (receta_id, datos) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/recetas/${receta_id}`, datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// Crear una nueva receta
export const crearReceta = async (datos) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/recetas", datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


//---------> FUNCIONES DE LOS USUARIOS <----------

// Registrar un usuario
export const registrarUsuario = async (datos) => {
  const response = await api.post("/registro", datos);
  return response.data;
};


// Iniciar sesión
export const iniciarSesion = async (credenciales) => {
  const response = await api.post("/login", new URLSearchParams(credenciales), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};


// Obtener perfil del usuario autenticado
export const obtenerPerfil = async (token) => {
  const response = await api.get("/perfil", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// Obtener recetas favoritas del usuario autenticado N
export const obtenerFavoritos = async (usuario_id, token) => {
  const response = await api.get(`/usuarios/${usuario_id}/favoritos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data
}


// Actualizar los datos personales del usuario autenticado N
export const actualizarUsuario = async (token, datos) => {
  const response = await api.put("/perfil", datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data
}



