import React, { useState } from "react";

const Perfil = ({ usuario }) => {
  const [error, setError] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: usuario.nombre,
    ape1: usuario.ape1,
    ape2: usuario.ape2,
    dni: usuario.dni,
    email: usuario.email,
    tel_movil: usuario.tel_movil,
    situacion: usuario.situacion
  });

  const tokenUsuario = sessionStorage.getItem("token");

  const modificarDato = (e) => {
    setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
  };

  const actualizarDatos = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/demandantes/${usuario.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify(datosUsuario),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Datos actualizados correctamente:", data);
        window.location.href = `/home/${usuario?.id}`;
      } else {
        console.error("Error al actualizar los datos:", data.message);
        setError("Error al actualizar los datos del demandante");
      }
    } catch (e) {
      console.error("Error en la solicitud:", e.message);
      setError(e.message);
    }
  };

  const enviarDatos = (e) => {
    e.preventDefault();
    actualizarDatos();
  };

  return (
    <div className="perfil">
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="container-perfil">
          <form className="form-perfil" onSubmit={enviarDatos}>
            <div className="datos-perfil">
              <div className="nombre">
                <label>Nombre</label>
                <input type="text" name="nombre" value={datosUsuario.nombre} onChange={modificarDato}/>
              </div>
              <div className="ape-1">
                <label>Primer apellido</label>
                <input type="text" name="ape1" value={datosUsuario.ape1} onChange={modificarDato}/>
              </div>
              <div className="ape-2">
                <label>Segundo apellido</label>
                <input type="text" name="ape2" value={datosUsuario.ape2} onChange={modificarDato}/>
              </div>
              <div className="dni">
                <label>DNI</label>
                <input type="text" name="dni" value={datosUsuario.dni} onChange={modificarDato}/>
              </div>
              <div className="email">
                <label>Email</label>
                <input type="email" name="email" value={datosUsuario.email} onChange={modificarDato}/>
              </div>
              <div className="telefono">
                <label>Teléfono</label>
                <input type="text" name="tel_movil" value={datosUsuario.tel_movil} onChange={modificarDato}/>
              </div>
              <div className="situacion">
                  <label className="select-situacion" htmlFor="select-situacion">Situación laboral:</label>
                  <select className="select-situacion" name="select-situacion" value={datosUsuario.situacion} onChange={modificarDato}>
                    <option value="1">Con empleo</option>
                    <option value="0">Sin empleo</option>
                  </select>
                </div>
            </div>
            <button className="guardar" type="submit">Guardar cambios</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Perfil;