import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Cambia esto si tu backend está en otro puerto

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Obtener todas las recetas
export const obtenerRecetas = async () => {
  const response = await api.get("/recetas");
  return response.data;
};

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
