import React, { useState, useEffect } from "react";

const Header = () => {
  // Inicializar el estado 'usuario' basado en el localStorage
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem("usuario"));

  const tokenUsuario = sessionStorage.getItem("token");

  useEffect(() => {
    const idUsuario = sessionStorage.getItem("idUsuario");
    if (idUsuario) {
      setUsuario(sessionStorage.getItem("usuario"));
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  const cerrarSesion = () => {

    const logout = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/logout", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenUsuario}`,
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log("Logout exitoso:", data.message);
          sessionStorage.clear();
          window.location.href = "/";
        } 
      } catch (e) {
        console.log(e.message);
      }
    };

    logout();
    // Limpiar el localStorage y redirigir al login
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