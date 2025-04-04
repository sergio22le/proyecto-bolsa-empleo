import React, { useState, useEffect } from "react";

const Header = () => {
  // Inicializar el estado 'usuario' basado en el localStorage
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem("usuario"));

  useEffect(() => {
    const idUsuario = sessionStorage.getItem("idUsuario");
    if (idUsuario) {
      setUsuario(sessionStorage.getItem("usuario"));
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  const cerrarSesion = () => {
    // Limpiar el localStorage y redirigir al login
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
      <header className="header">
        <div className="titulo-pagina">
          <h2>Bolsa de empleo</h2>
        </div>
        {usuario && ( // Renderiza el mensaje y botón solo si hay sesión activa
          <div className="usuario-header">
            <p>Bienvenido, <a className="enlace-perfil" href="/perfil">{usuario}</a></p>
            <div className="div-sesion">
              <button onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </header>
  );
};

export default Header;