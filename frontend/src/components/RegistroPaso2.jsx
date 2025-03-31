import React, { useState } from "react";
import './RegistroPaso2.css';

const RegistroPaso2 = ({ tipoRegistro }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    dni: "",
    telefono: "",
    tel_movil: "",
    email: "",
    cif: "",
    validado: 0,
    localidad: "",
    situacion: "",
  });

  const actualizarDatos = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarDatosDemandante = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/demandantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: formData.dni,
          nombre: formData.nombre,
          ape1: formData.primerApellido,
          ape2: formData.segundoApellido,
          tel_movil: formData.tel_movil,
          email: formData.email,
          situacion: parseInt(formData.situacion),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Demandante registrado exitosamente.");
        window.location.href = `http://localhost:5173/homeDemandante`;
      } else {
        alert(data.message || "Error en el registro de demandante");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en el servidor");
    }
  };

  const enviarDatosEmpresa = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          validado: 0,
          nombre: formData.nombre,
          cif: formData.cif,
          localidad: formData.localidad,
          telefono: formData.telefono,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Empresa registrada exitosamente.");
        window.location.href = `http://localhost:5173/homeEmpresa`;
      } else {
        alert(data.message || "Error en el registro de empresa");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en el servidor");
    }
  };

  return (
    <form onSubmit={tipoRegistro === "demandante" ? enviarDatosDemandante : enviarDatosEmpresa} className="form-registro">
      {tipoRegistro === "demandante" && (
        <>
          <label htmlFor="nombre">Nombre</label>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={actualizarDatos} required />
          <label htmlFor="ape1">Primer apellido</label>
          <input type="text" name="primerApellido" placeholder="Primer Apellido" value={formData.primerApellido} onChange={actualizarDatos} required />
          <label htmlFor="ape2">Segundo apellido</label>
          <input type="text" name="segundoApellido" placeholder="Segundo Apellido" value={formData.segundoApellido} onChange={actualizarDatos} />
          <label htmlFor="dni">DNI</label>
          <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={actualizarDatos} required />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={actualizarDatos} required />
          <label htmlFor="tel_movil">Teléfono móvil</label>
          <input type="text" name="tel_movil" placeholder="Teléfono móvil" value={formData.tel_movil} onChange={actualizarDatos} required />
          <div className="div-select">
            <label htmlFor="situacion">Situación laboral:</label>
            <select name="situacion" value={formData.situacion} onChange={actualizarDatos}>
              <option value="1">Con empleo</option>
              <option value="0">Sin empleo</option>
            </select>
          </div>
          <button type="submit">Registrar Demandante</button>
        </>
      )}
      {tipoRegistro === "empresa" && (
        <>
          <label htmlFor="nombre">Nombre</label>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={actualizarDatos} required />
          <label htmlFor="cif">CIF</label>
          <input type="text" name="cif" placeholder="CIF" value={formData.cif} onChange={actualizarDatos} required />
          <label htmlFor="localidad">Localidad</label>
          <input type="text" name="localidad" placeholder="Localidad" value={formData.localidad} onChange={actualizarDatos} />
          <label htmlFor="telefono">Teléfono</label>
          <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={actualizarDatos} required />
          <button type="submit">Registrar Empresa</button>
        </>
      )}
    </form>
  );
};

export default RegistroPaso2;