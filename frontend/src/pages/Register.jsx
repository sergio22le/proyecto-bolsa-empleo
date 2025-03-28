import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  // Estado para el tipo de usuario (solicitante o empresa)
  const [role, setRole] = useState("solicitante");

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nif: "",
    cif: "",
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
      role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      nif: role === "solicitante" ? formData.nif : null,
      cif: role === "empresa" ? formData.cif : null,
    };

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Esperando aprobación si es empresa.");
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
      <h2>Registro</h2>

      {/* Selector de rol */}
      <label>Tipo de usuario: </label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="solicitante">Solicitante</option>
        <option value="empresa">Empresa</option>
      </select>

      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required/>
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required/>
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required/>
        <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} required/>

        {/* Si es solicitante, pedimos NIF */}
        {role === "solicitante" && (
          <input type="text" name="nif" placeholder="NIF" value={formData.nif} onChange={handleChange} required/>
        )}

        {/* Si es empresa, pedimos CIF */}
        {role === "empresa" && (
          <input type="text" name="cif" placeholder="CIF" value={formData.cif} onChange={handleChange} required/>
        )}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
