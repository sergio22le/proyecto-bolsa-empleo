// Este componente maneja el registro de usuarios (demandantes o empresas).
import { API_URL } from "../config";
import React, { useState } from "react";

const Registro = () => {
  // Estado para determinar el tipo de registro (demandante o empresa)
  const [tipoRegistro, setTipoRegistro] = useState("demandante");

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    ape1: "",
    ape2: "",
    usuario: "",
    dni: "",
    tel_movil: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    situacion: 0,
    cif: "",
    localidad: "",
    tipo: "demandante",
  });

  // Estado para manejar errores específicos y generales
  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  // Función para actualizar los datos del formulario
  const actualizarDatos = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para enviar los datos del formulario al backend
  const enviarDatos = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorGeneral("");

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setErrorGeneral("Las contraseñas no coinciden");
      return;
    }

    // Preparar los datos según el tipo de registro
    const dataToSend =
      tipoRegistro === "demandante"
        ? {
            dni: formData.dni,
            nombre: formData.nombre,
            ape1: formData.ape1,
            ape2: formData.ape2,
            tel_movil: formData.tel_movil,
            email: formData.email,
            situacion: parseInt(formData.situacion),
            usuario: formData.usuario,
            password: formData.password,
            tipo: tipoRegistro,
          }
        : {
            cif: formData.cif,
            nombre: formData.nombre,
            localidad: formData.localidad,
            telefono: formData.telefono,
            usuario: formData.usuario,
            password: formData.password,
            tipo: tipoRegistro,
          };

    try {
      // Enviar los datos al backend
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Ya puedes iniciar sesión.");
        window.location.href = `http://localhost:5173`;
      } else if (data.errors) {
        setErrors(data.errors); // Capturar errores de validación
      } else {
        setErrorGeneral(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorGeneral("Error en el servidor");
    }
  };

  return (
    <section className="registro">
      <div className="registro-body">
        <h2>Registro</h2>
        {/* Botones para seleccionar el tipo de registro */}
        <div className="seleccion-usuario">
          <button
            className={tipoRegistro === "demandante" ? "activo" : ""}
            onClick={() => setTipoRegistro("demandante")}
          >
            Demandante
          </button>
          <button
            className={tipoRegistro === "empresa" ? "activo" : ""}
            onClick={() => setTipoRegistro("empresa")}
          >
            Empresa
          </button>
        </div>
        <div className="div-form">
          {/* Formulario de registro */}
          <form onSubmit={enviarDatos} className="form-registro">
            {/* Mostrar errores generales */}
            {errorGeneral && <p className="error">{errorGeneral}</p>}
            {tipoRegistro === "demandante" && (
              <>
                {/* Campos específicos para demandantes */}
                <div>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.nombre && <p className="error">{errors.nombre[0]}</p>}
                </div>
                <div>
                  <label htmlFor="ape1">Primer apellido</label>
                  <input
                    type="text"
                    name="ape1"
                    placeholder="Primer Apellido"
                    value={formData.ape1}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.ape1 && <p className="error">{errors.ape1[0]}</p>}
                </div>
                <div>
                  <label htmlFor="ape2">Segundo apellido</label>
                  <input
                    type="text"
                    name="ape2"
                    placeholder="Segundo Apellido"
                    value={formData.ape2}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.ape2 && <p className="error">{errors.ape2[0]}</p>}
                </div>
                <div>
                  <label htmlFor="dni">DNI</label>
                  <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.dni && <p className="error">{errors.dni[0]}</p>}
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.email && <p className="error">{errors.email[0]}</p>}
                </div>
                <div>
                  <label htmlFor="tel_movil">Teléfono móvil</label>
                  <input
                    type="tel"
                    name="tel_movil"
                    placeholder="Teléfono"
                    value={formData.tel_movil}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.tel_movil && <p className="error">{errors.tel_movil[0]}</p>}
                </div>
                <div>
                  <label htmlFor="usuario">Usuario</label>
                  <input
                    type="text"
                    name="usuario"
                    placeholder="Usuario"
                    value={formData.usuario}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.usuario && <p className="error">{errors.usuario[0]}</p>}
                </div>
                <div>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.password && <p className="error">{errors.password[0]}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={actualizarDatos}
                    required
                  />
                </div>
                <div className="div-select">
                  <label htmlFor="select-situacion">Situación laboral:</label>
                  <select
                    className="select-situacion"
                    name="situacion"
                    value={formData.situacion}
                    onChange={actualizarDatos}
                  >
                    <option value="1">Con empleo</option>
                    <option value="0">Sin empleo</option>
                  </select>
                </div>
                <div>
                  <button id="registro-demandante" type="submit">
                    Registrarse
                  </button>
                </div>
              </>
            )}
            {tipoRegistro === "empresa" && (
              <>
                {/* Campos específicos para empresas */}
                <div>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.nombre && <p className="error">{errors.nombre[0]}</p>}
                </div>
                <div>
                  <label htmlFor="cif">CIF</label>
                  <input
                    type="text"
                    name="cif"
                    placeholder="CIF"
                    value={formData.cif}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.cif && <p className="error">{errors.cif[0]}</p>}
                </div>
                <div>
                  <label htmlFor="localidad">Localidad</label>
                  <input
                    type="text"
                    name="localidad"
                    placeholder="Localidad"
                    value={formData.localidad}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.localidad && <p className="error">{errors.localidad[0]}</p>}
                </div>
                <div>
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono Móvil"
                    value={formData.telefono}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.telefono && <p className="error">{errors.telefono[0]}</p>}
                </div>
                <div>
                  <label htmlFor="usuario">Usuario</label>
                  <input
                    type="text"
                    name="usuario"
                    placeholder="Usuario"
                    value={formData.usuario}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.usuario && <p className="error">{errors.usuario[0]}</p>}
                </div>
                <div>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={actualizarDatos}
                    required
                  />
                  {errors.password && <p className="error">{errors.password[0]}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={actualizarDatos}
                    required
                  />
                </div>
                <div>
                  <button id="registro-empresa" type="submit">
                    Registrarse
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <div className="volver">
          <a className="volver" href="../">
            Volver
          </a>
        </div>
      </div>
    </section>
  );
};

export default Registro;