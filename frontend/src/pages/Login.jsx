import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Para redirigir después de iniciar sesión

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const credenciales = {
      username: email,
      password: password,
    };
  
    const response = await iniciarSesion(credenciales);
    localStorage.setItem("token", response.access_token);
    localStorage.setItem("usuario_id", response.usuario_id);
    
  
    navigate("/"); // Redirige a la página de inicio después del login
    window.location.reload(); // Recarga solo para actualizar el estado en el Navbar
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit} className="flex flex-col bg-gray-100 p-6 rounded-lg shadow-md">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Entrar
        </button>
      </form>

      <p className="mt-4">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="text-blue-500 hover:underline">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
