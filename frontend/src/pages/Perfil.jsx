import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPerfil, actualizarUsuario } from "../services/api";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [mostrarModalNombre, setMostrarModalNombre] = useState(false);
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);
  const [mostrarModalContrasena, setMostrarModalContrasena] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [passwordData, setPasswordData] = useState({
    actual: "",
    nueva: "",
    confirmacion: "",
  });
  const [confirmacionEliminar, setConfirmacionEliminar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerPerfil(token).then((data) => {
        setUsuario(data);
        setNewName(data.nombre);
      });
    }
  }, []);

  const handleUpdateName = () => {
    if (newName.trim() === "") {
      alert("El nombre no puede estar vacío");
      return;
    }
    const updatedUsuario = { ...usuario, nombre: newName };
    const token = localStorage.getItem("token");
    actualizarUsuario(token, updatedUsuario).then(() => {
      setUsuario(updatedUsuario);
      alert("Nombre actualizado");
      setMostrarModalNombre(false);
    });
  };

  const handleUpdateEmail = () => {
    if (newEmail !== confirmEmail) {
      alert("Los correos no coinciden");
      return;
    }
    if (newEmail.trim() === "") {
      alert("El email no puede estar vacío");
      return;
    }
    const updatedUsuario = { ...usuario, email: newEmail };
    const token = localStorage.getItem("token");
    actualizarUsuario(token, updatedUsuario).then(() => {
      setUsuario(updatedUsuario);
      alert("Email actualizado");
      setMostrarModalEmail(false);
    });
  };

  const handleCambiarContrasena = () => {
    if (passwordData.nueva !== passwordData.confirmacion) {
      alert("Las nuevas contraseñas no coinciden");
      return;
    }
    // Aquí podrías implementar la llamada a la API para cambiar la contraseña
    console.log("Contraseña cambiada", passwordData);
    alert("Contraseña actualizada");
    setMostrarModalContrasena(false);
  };

  const handleEliminarCuenta = () => {
    if (confirmacionEliminar !== "Eliminar mi cuenta") {
      alert("Debes escribir 'Eliminar mi cuenta' para confirmar");
      return;
    }
    // Aquí podrías llamar a la API para eliminar la cuenta
    console.log("Cuenta eliminada");
    alert("Cuenta eliminada");
    navigate("/");
  };

  return (
    <div className="p-4 mt-16">
      {/* Tarjeta principal con fondo gris sutil */}
      <div className="max-w-lg mx-auto my-10 bg-neutral-200 shadow-lg rounded-lg p-10">
        {/* Sección 1: Avatar, Nombre y Email */}
        <div className="flex flex-col items-center border-b pb-4 mb-4">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {usuario && usuario.nombre ? usuario.nombre[0].toUpperCase() : "?"}
          </div>
          <h2 className="test-nombreusuario text-2xl font-bold">
            {usuario ? usuario.nombre : "Cargando..."}
          </h2>
          <p className="text-gray-600">{usuario ? usuario.email : ""}</p>
        </div>

        {/* Sección 2: Opciones de acción */}
        <div className="flex flex-col gap-4">
          <button
            className="test-cambiarnombre-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setMostrarModalNombre(true)}
          >
            Cambiar Nombre
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setMostrarModalEmail(true)}
          >
            Cambiar Email
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={() => setMostrarModalContrasena(true)}
          >
            Cambiar Contraseña
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => setMostrarModalEliminar(true)}
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>

      {/* Modal para cambiar Nombre */}
      {mostrarModalNombre && (
        <div
          id="modalFondo"
          className="test-cambiarnombre-modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target.id === "modalFondo") setMostrarModalNombre(false);
          }}
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-auto relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-black text-s hover:text-red-500"
              onClick={() => setMostrarModalNombre(false)}
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Cambiar Nombre</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Nuevo Nombre"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleUpdateName}
            >
              Actualizar Nombre
            </button>
          </div>
        </div>
      )}

      {/* Modal para cambiar Email */}
      {mostrarModalEmail && (
        <div
          id="modalFondo"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target.id === "modalFondo") setMostrarModalEmail(false);
          }}
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-auto relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-black text-s hover:text-red-500"
              onClick={() => setMostrarModalEmail(false)}
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Cambiar Email</h2>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Nuevo Email"
            />
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Confirmar Nuevo Email"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleUpdateEmail}
            >
              Actualizar Email
            </button>
          </div>
        </div>
      )}

      {/* Modal para cambiar Contraseña */}
      {mostrarModalContrasena && (
        <div
          id="modalFondo"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target.id === "modalFondo") setMostrarModalContrasena(false);
          }}
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-auto relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-black text-s hover:text-red-500"
              onClick={() => setMostrarModalContrasena(false)}
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Cambiar Contraseña</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.actual}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, actual: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.nueva}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, nueva: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmacion}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmacion: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={handleCambiarContrasena}
              >
                Actualizar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar Cuenta */}
      {mostrarModalEliminar && (
        <div
          id="modalFondo"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target.id === "modalFondo") setMostrarModalEliminar(false);
          }}
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-auto relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-black text-s hover:text-red-500"
              onClick={() => setMostrarModalEliminar(false)}
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Eliminar Cuenta</h2>
            <p className="mb-4 text-gray-700">
              ¿Estás seguro que deseas eliminar tu cuenta? Esta acción es irreversible y no podrás recuperarla.
            </p>
            <input
              type="text"
              value={confirmacionEliminar}
              onChange={(e) => setConfirmacionEliminar(e.target.value)}
              placeholder="Escribe 'Eliminar mi cuenta'"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={handleEliminarCuenta}
            >
              Confirmar Eliminación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
