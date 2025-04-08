import React, { useState, useEffect } from "react";
import HomeAdmin from "./HomeAdmin";
import HomeEmpresa from "./HomeEmpresa";
import HomeDemandante from "./HomeDemandante";

function Home() {
  const [tipoUsuario, setTipoUsuario] = useState(""); // Estado para almacenar el tipo de usuario

  // Obtener los datos de la sesión al cargar la página
  useEffect(() => {
    setTipoUsuario(sessionStorage.getItem('tipo'));
  }, []);

  return (
      <section className="home-section">
          <>
            {/* Renderizar componentes según el tipo de usuario */}
            {tipoUsuario === "demandante" && <HomeDemandante />}
            {tipoUsuario === "admin" && <HomeAdmin />}
            {tipoUsuario === "empresa" && <HomeEmpresa />}
          </>
      </section>
  );
}

export default Home;