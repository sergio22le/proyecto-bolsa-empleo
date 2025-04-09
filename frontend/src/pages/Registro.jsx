import React, { useState } from "react";

const Registro = () => {
  const [tipoRegistro, setTipoRegistro] = useState("demandante");
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

  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const actualizarDatos = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorGeneral("");

    if (formData.password !== formData.confirmPassword) {
      setErrorGeneral("Las contraseñas no coinciden");
      return;
    }

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
      const response = await fetch(`http://localhost:8000/api/register`, {
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
          <form onSubmit={enviarDatos} className="form-registro">
            {errorGeneral && <p className="error">{errorGeneral}</p>}
            {tipoRegistro === "demandante" && (
              <>
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