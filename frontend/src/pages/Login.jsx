import { useState } from "react";
import "./Login.css";
import Header from "../components/header";
import Footer from "../components/footer";

function Login() {
  // Estados para demandante
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el login de demandantes
  const login = async (e) => {
    // Evitar el comportamiento por defecto del formulario
    e.preventDefault();
    // Resetear los posibles errores previos
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
        credentials: "include", // Si se usan cookies para mantener sesión
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Guardar datos de usuario en localStorage
        localStorage.setItem("tipoUsuario", data.tipo); 
        localStorage.setItem("usuario", data.usuario);
        localStorage.setItem("usuarioId", data.id); 
  
        // Redireccionar a la página correspondiente
        window.location.href = `http://localhost:5173/home`;

      } else {
        setError(data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Error en el servidor");
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-body">
        <h2>Iniciar Sesión</h2>
        <div className="login-container">
          <div className="form-login">
            <h3>Introducir datos</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="form" onSubmit={login}>
              <label htmlFor="usuario">Usuario</label>
              <input id="usuario" type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required/>
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              <button className="iniciar-sesion" type="submit">Iniciar sesión</button>
            </form>
            <div className="boton-registro">
              <button className="registro" onClick={() => (window.location.href = "/registro")}>Regístrate</button>
            </div>     
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
