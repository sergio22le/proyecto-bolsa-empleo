import React, { useState } from "react";
import "./RegistroEmpresa.css";

const RegistroEmpresa = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    telefono: "",
    localidad: "",
    usuario: "",
    password: "",
    confirmPassword: "",
  });

  // Manejar cambios en los campos de entrada
  const actualizarDatos = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const enviarDatos = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Preparar los datos para enviar
    const userData = {
      nombre: formData.nombre,
      cif: formData.cif,
      telefono: formData.telefono,
      localidad: formData.localidad,
      usuario: formData.usuario,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/register-demandante", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Ya puedes iniciar sesión.");
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en el servidor");
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Empresa</h2>

      <form onSubmit={enviarDatos} className="register-form">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={actualizarDatos} required />
        <input type="text" name="cif" placeholder="CIF" value={formData.cif} onChange={actualizarDatos} required />
        <input type="tel" name="telefono" placeholder="Teléfono Móvil" value={formData.telefono} onChange={actualizarDatos} required />
        <input type="localidad" name="localidad" placeholder="Localidad" value={formData.localidad} onChange={actualizarDatos} required />
        <input type="text" name="usuario" placeholder="Usuario" value={formData.usuario} onChange={actualizarDatos} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={actualizarDatos} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={actualizarDatos} required />

        <button type="submit">Registrarse</button>
      </form>
      
      <a href="../">Volver</a>
    </div>
  );
};

export default RegistroEmpresa;