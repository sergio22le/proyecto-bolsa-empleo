import React, { useState } from "react";
import "./Registro.css";
import Header from "../components/header";
import Footer from "../components/footer";

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

  const actualizarDatos = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para enviar datos del Demandante
  const enviarDatosDemandante = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const demandanteData = {
      dni: formData.dni,
      nombre: formData.nombre,
      ape1: formData.ape1,
      ape2: formData.ape2,
      tel_movil: formData.tel_movil,
      email: formData.email,
      situacion: parseInt(formData.situacion),
      usuario: formData.usuario,
      password: formData.password,
      tipo: tipoRegistro
    };

    try {
      const response = await fetch(`http://localhost:8000/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demandanteData),
        credentials: "include", // Si se usan cookies para mantener sesion
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registro exitoso. Ya puedes iniciar sesión.");
        window.location.href = `http://localhost:5173`;
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en el servidor");
    }
  };

  // Función para enviar datos de la Empresa
  const enviarDatosEmpresa = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const empresaData = {
      cif: formData.cif,
      nombre: formData.nombre,
      localidad: formData.localidad,
      telefono: formData.telefono,
      usuario: formData.usuario,
      password: formData.password,
      tipo: tipoRegistro
    };

    try {
      const response = await fetch(`http://localhost:8000/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresaData),
        credentials: "include", // Si se usan cookies para mantener sesion
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registro exitoso. Ya puedes iniciar sesión.");
        window.location.href = `http://localhost:5173`;
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en el servidor");
    }
  };

  return (
    <div className="registro">
      <Header />
      <div className="registro-body">
        <h2>Registro</h2>
        <div className="seleccion-usuario">
          <button className={tipoRegistro === "demandante" ? "activo" : ""} onClick={() => setTipoRegistro("demandante")}>
            Demandante
          </button>
          <button className={tipoRegistro === "empresa" ? "activo" : ""} onClick={() => setTipoRegistro("empresa")}>
            Empresa
          </button>
        </div>
        <div className="div-form">
          <form
            onSubmit={tipoRegistro === "demandante" ? enviarDatosDemandante : enviarDatosEmpresa}
            className="form-registro"
          >
            {tipoRegistro === "demandante" && (
              <>
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={actualizarDatos} required />
                <input type="text" name="ape1" placeholder="Primer Apellido" value={formData.ape1} onChange={actualizarDatos} required />
                <input type="text" name="ape2" placeholder="Segundo Apellido" value={formData.ape2} onChange={actualizarDatos} required />
                <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={actualizarDatos} required />
                <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={actualizarDatos} required />
                <input type="tel" name="tel_movil" placeholder="Teléfono Móvil" value={formData.tel_movil} onChange={actualizarDatos} required />
                <input type="text" name="usuario" placeholder="Usuario" value={formData.usuario} onChange={actualizarDatos} required />
                <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={actualizarDatos} required />
                <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={actualizarDatos} required /> 
                <div className="div-select">
                  <label htmlFor="select-situacion">Situación laboral:</label>
                  <select className="select-situacion" name="situacionLaboral" value={formData.situacion} onChange={actualizarDatos}>
                    <option value="1">Con empleo</option>
                    <option value="0">Sin empleo</option>
                  </select>
                </div>
                <button id="registro-demandante" type="submit">Registrarse</button>
              </>
            )}
            {tipoRegistro === "empresa" && (
              <>
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={actualizarDatos} required />
                <input type="text" name="cif" placeholder="CIF" value={formData.cif} onChange={actualizarDatos} required />
                <input type="text" name="localidad" placeholder="Localidad" value={formData.localidad} onChange={actualizarDatos} required />
                <input type="tel" name="telefono" placeholder="Teléfono Móvil" value={formData.telefono} onChange={actualizarDatos} required />
                <input type="text" name="usuario" placeholder="Usuario" value={formData.usuario} onChange={actualizarDatos} required />
                <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={actualizarDatos} required />
                <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={actualizarDatos} required />
                <div className="boton-registro">
                  <button id="registro-empresa" type="submit">Registrarse</button>
                </div>
              </>
            )}
          </form>
        </div>
        <a href="../">Volver</a>
      </div>
      <Footer />
    </div>
  );
};

export default Registro;
