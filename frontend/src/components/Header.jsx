import React, { useState, useEffect } from "react";

const Header = () => {
  // Obtener el usuario directamente del localStorage
  const usuarioGuardado = localStorage.getItem("usuario");
  const [usuario, setUsuario] = useState(usuarioGuardado);

  useEffect(() => {
    // Solo actualiza el estado si no se cargó correctamente en el inicio
    if (!usuario && usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
  }, [usuario, usuarioGuardado]);

  const cerrarSesion = () => {
    // Limpiar el localStorage y redirigir al login
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="div-header">
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
    </div>
  );
};

export default Header;