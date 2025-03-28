import React, { useState } from "react";
import "./RegistroDemandante.css";

const RegistroDemandante = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    usuario: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    situacionLaboral: "sin empleo",
  });

  // Manejar cambios en los campos de entrada
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Preparar los datos para enviar
    const userData = {
      nombre: formData.nombre,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      usuario:formData.usuario,
      dni: formData.dni,
      telefono: formData.telefono,
      email: formData.email,
      password: formData.password,
      situacionLaboral: formData.situacionLaboral,
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
      <h2>Registro de Demandante</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="primerApellido" placeholder="Primer Apellido" value={formData.primerApellido} onChange={handleChange} required />
        <input type="text" name="segundoApellido" placeholder="Segundo Apellido" value={formData.segundoApellido} onChange={handleChange} required />
        <input type="text" name="usuario" placeholder="Usuario" value={formData.usuario} onChange={handleChange} required />
        <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleChange} required />
        <input type="tel" name="telefono" placeholder="Teléfono Móvil" value={formData.telefono} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} required />

        {/* Selector de Situación Laboral */}
        <label>Situación Laboral:</label>
        <select className="select-situacion" name="situacionLaboral" value={formData.situacionLaboral} onChange={handleChange}>
          <option value="con empleo">Con empleo</option>
          <option value="sin empleo">Sin empleo</option>
        </select>

        <button type="submit">Registrarse</button>
      </form>

      <a href="../">Volver</a>
    </div>
  );
};

export default RegistroDemandante;
