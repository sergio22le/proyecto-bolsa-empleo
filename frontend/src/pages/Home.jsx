import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Oferta from "../components/Oferta";
import Empresa from "../components/Empresa";
import "./Home.css";

function Home() {
  const [tipoUsuario, setTipoUsuario] = useState(""); // Estado para el tipo de usuario

  useEffect(() => {
    // Obtener el tipo de usuario del localStorage cuando el componente se monta
    const tipo = localStorage.getItem("tipoUsuario");
    setTipoUsuario(tipo); // Actualizar el estado con el tipo de usuario
  }, []);

  return (
    <div>
      <Header />
      {tipoUsuario === "demandante" && <Oferta />} {/* Renderizar Oferta si es demandante */}
      {tipoUsuario === "admin" && <Empresa />} {/* Renderizar Empresa si es admin */}
      <Footer />
    </div>
  );
}

export default Home;