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
          <div>
            <button className="cerrar-sesion" onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        )}
      </header>
  );
};

export default Header;