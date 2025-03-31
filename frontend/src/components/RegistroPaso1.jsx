import React, { useState } from "react";
import './RegistroPaso1.css';

const RegistroPaso1 = ({ onRegistroExitoso }) => {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
    confirmPassword: "",
    tipoRegistro: "",
  });

  const actualizarDatos = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: formData.usuario,
          password: formData.password,
          tipo: formData.tipoRegistro,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Usuario registrado exitosamente.");
        onRegistroExitoso(formData.tipoRegistro); // Pasar el tipo de registro al siguiente paso
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en el servidor");
    }
  };

  return (
    <div className="registro-body">
      <h2>Selecciona tu perfil</h2>
      <div className="seleccion-usuario">
        <button type="button" className={formData.tipoRegistro === "demandante" ? "activo" : ""} onClick={() => setFormData({ ...formData, tipoRegistro: "demandante" })} >Demandante</button>
        <button type="button" className={formData.tipoRegistro === "empresa" ? "activo" : ""} onClick={() => setFormData({ ...formData, tipoRegistro: "empresa" })}>Empresa</button>
      </div>

      {/* Muestra el formulario solo si tipoRegistro está definido */}
      {formData.tipoRegistro && (
        <form onSubmit={enviarDatos} className="form-registro">
          <label htmlFor="usuario">Usuario</label>
          <input type="text" name="usuario" placeholder="Usuario" value={formData.usuario} onChange={actualizarDatos} required/>
          <label htmlFor="password">Contraseña</label>
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={actualizarDatos} required/>
          <label htmlFor="confirmPassword">Confirma contraseña</label>
          <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={actualizarDatos} required/>
          <div className="boton-registro">
            <button type="submit">Siguiente</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistroPaso1;
