// Este componente representa el encabezado de la aplicación, mostrando el título y un botón para cerrar sesión si el usuario está autenticado.
import { API_URL } from "../config";
import React, { useState, useEffect } from "react";

const Header = () => {
  // Estado para almacenar el nombre del usuario autenticado
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem("usuario"));

  // Token del usuario almacenado en sessionStorage
  const tokenUsuario = sessionStorage.getItem("token");

  // useEffect para verificar si hay un usuario autenticado al cargar el componente
  useEffect(() => {
    const idUsuario = sessionStorage.getItem("idUsuario");
    if (idUsuario) {
      setUsuario(sessionStorage.getItem("usuario")); // Establecer el nombre del usuario en el estado
    }
  }, []);

  // Función para cerrar sesión
  const cerrarSesion = () => {
    const logout = async () => {
      try {
        // Realizar una solicitud al backend para cerrar sesión
        const response = await fetch(`${API_URL}/logout`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenUsuario}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Logout exitoso:", data.message);
          sessionStorage.clear(); // Limpiar el almacenamiento de sesión
          window.location.href = "/"; // Redirigir al usuario a la página de inicio
        }
      } catch (e) {
        console.log(e.message); // Manejar errores en la solicitud
      }
    };

    logout(); // Llamar a la función de logout
  };

  return (
    <header className="header">
      <div className="titulo-pagina">
        {/* Título de la aplicación */}
        <h2>Bolsa de empleo</h2>
      </div>
      {usuario && (
        <div>
          {/* Botón para cerrar sesión si el usuario está autenticado */}
          <button className="cerrar-sesion" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;