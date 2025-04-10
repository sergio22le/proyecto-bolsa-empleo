// Este componente permite a los usuarios actualizar su perfil personal.
import { API_URL } from "../config";
import React, { useState } from "react";

const Perfil = ({ usuario }) => {
  // Estado para manejar errores al actualizar los datos
  const [error, setError] = useState(null);

  // Estado para almacenar los datos del usuario que se pueden editar
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: usuario.nombre,
    ape1: usuario.ape1,
    ape2: usuario.ape2,
    dni: usuario.dni,
    email: usuario.email,
    tel_movil: usuario.tel_movil,
    situacion: usuario.situacion,
  });

  // Token del usuario almacenado en sessionStorage
  const tokenUsuario = sessionStorage.getItem("token");

  // Función para manejar los cambios en los campos del formulario
  const modificarDato = (e) => {
    setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
  };

  // Función para enviar los datos actualizados al backend
  const actualizarDatos = async () => {
    try {
      const response = await fetch(`${API_URL}/demandantes/${usuario.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify(datosUsuario), // Enviar los datos actualizados
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Datos actualizados correctamente:", data);
        window.location.href = `/home`; // Redirigir al usuario a la página principal
      } else {
        console.error("Error al actualizar los datos:", data.message);
        setError("Error al actualizar los datos del demandante"); // Mostrar mensaje de error
      }
    } catch (e) {
      console.error("Error en la solicitud:", e.message);
      setError(e.message); // Manejar errores de conexión o del servidor
    }
  };

  // Función para manejar el envío del formulario
  const enviarDatos = (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    actualizarDatos(); // Llamar a la función para actualizar los datos
  };

  return (
    <div className="perfil">
      {error ? (
        // Mostrar mensaje de error si existe
        <p className="error">{error}</p>
      ) : (
        <div className="container-perfil">
          <form className="form-perfil" onSubmit={enviarDatos}>
            <div className="datos-perfil">
              {/* Campos del formulario para editar los datos del usuario */}
              <div className="nombre">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={datosUsuario.nombre}
                  onChange={modificarDato}
                />
              </div>
              <div className="ape-1">
                <label>Primer apellido</label>
                <input
                  type="text"
                  name="ape1"
                  value={datosUsuario.ape1}
                  onChange={modificarDato}
                />
              </div>
              <div className="ape-2">
                <label>Segundo apellido</label>
                <input
                  type="text"
                  name="ape2"
                  value={datosUsuario.ape2}
                  onChange={modificarDato}
                />
              </div>
              <div className="dni">
                <label>DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={datosUsuario.dni}
                  onChange={modificarDato}
                />
              </div>
              <div className="email">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={datosUsuario.email}
                  onChange={modificarDato}
                />
              </div>
              <div className="telefono">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="tel_movil"
                  value={datosUsuario.tel_movil}
                  onChange={modificarDato}
                />
              </div>
              <div className="situacion">
                <label className="select-situacion" htmlFor="select-situacion">
                  Situación laboral:
                </label>
                <select
                  className="select-situacion"
                  name="situacion"
                  value={datosUsuario.situacion}
                  onChange={modificarDato}
                >
                  <option value="1">Con empleo</option>
                  <option value="0">Sin empleo</option>
                </select>
              </div>
            </div>
            {/* Botón para guardar los cambios */}
            <button className="guardar" type="submit">
              Guardar cambios y volver
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Perfil;