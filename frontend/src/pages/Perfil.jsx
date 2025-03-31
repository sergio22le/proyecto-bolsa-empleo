import React, { useState, useEffect } from "react";
import "./Perfil.css";
import Header from "../components/header";
import Footer from "../components/footer";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(""); // Para almacenar el tipo de usuario

  useEffect(() => {
    // Obtener el tipo de usuario desde el localStorage
    const tipo = localStorage.getItem("tipoUsuario");
    const id = localStorage.getItem("usuarioId"); // El ID del usuario también debería estar guardado
    setTipoUsuario(tipo);

    // Determinar el endpoint según el tipo de usuario
    const endpoint =
      tipo === "demandante"
        ? `http://localhost:8000/api/demandantes/${id}`
        : `http://localhost:8000/api/empresas/${id}`;

    // Realizar la petición al endpoint correspondiente
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setUsuario(data);
      })
      .catch((error) => console.error("Error al cargar los datos:", error));
  }, []);

  if (!usuario || !tipoUsuario) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="perfil">
      <Header />
      <div className="body-perfil">
        <h1>
          Perfil {tipoUsuario === "demandante" ? "personal de" : "de la empresa"}{" "}
          {usuario.nombre}
        </h1>
        <div className="container-perfil">
          <form className="form-perfil">
            <div className="datos-perfil">
              <div className="nombre">
                <label>Nombre</label>
                <input type="text" value={usuario.nombre} readOnly />
              </div>
              {tipoUsuario === "demandante" && (
                <>
                  <div className="ape-1">
                    <label>Primer apellido</label>
                    <input type="text" value={usuario.primer_apellido} readOnly />
                  </div>
                  <div className="ape-2">
                    <label>Segundo apellido</label>
                    <input type="text" value={usuario.segundo_apellido} readOnly />
                  </div>
                  <div className="dni">
                    <label>DNI</label>
                    <input type="text" value={usuario.dni} readOnly />
                  </div>
                </>
              )}
              {tipoUsuario === "empresa" && (
                <>
                  <div className="cif">
                    <label>CIF</label>
                    <input type="text" value={usuario.cif} readOnly />
                  </div>
                  <div className="localidad">
                    <label>Localidad</label>
                    <input type="text" value={usuario.localidad} readOnly />
                  </div>
                </>
              )}
              <div className="email">
                <label>Email</label>
                <input type="email" value={usuario.email} readOnly />
              </div>
              <div className="telefono">
                <label>Teléfono</label>
                <input type="text" value={usuario.telefono} readOnly />
              </div>
            </div>
            <button className="guardar" type="submit">
              Guardar cambios
            </button>
          </form>
        </div>
        <a className="volver" href="/home">
          Volver
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default Perfil;