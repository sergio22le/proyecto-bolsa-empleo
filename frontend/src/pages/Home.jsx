import React, { useState, useEffect } from "react";
import Ofertas from "../components/Ofertas";
import Empresas from "../components/Empresas";

function Home() {
  const [tipoUsuario, setTipoUsuario] = useState(""); // Estado para almacenar el tipo de usuario

  // Obtener los datos de la sesión al cargar la página
  useEffect(() => {
    setTipoUsuario(sessionStorage.getItem('tipo'));
  }, []);

  return (
      <div className="home-body">
          <>
            {/* Renderizar componentes según el tipo de usuario */}
            {tipoUsuario === "demandante" && <Ofertas />}
            {tipoUsuario === "admin" && <Empresas />}
            {tipoUsuario === "empresa" && <Solicitudes />}
          </>
      </div>
  );
}

export default Home;