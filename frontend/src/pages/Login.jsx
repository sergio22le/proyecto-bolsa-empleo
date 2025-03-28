import { useState } from "react";
import "./Login.css";

function Login() {
  // Estados para usuario y contraseña
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar datos al backend usando fetch
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      // Redirigir al Home si el login es exitoso
      window.location.href = "/home";
    } else {
      // Mostrar mensaje de error
      setError(data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" id="usuario" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required/>
        <input type="password" id="contraseña" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <button type="submit">Iniciar sesión</button>
      </form>
      <button class="register" onClick={() => (window.location.href = "/register")}>Regístrate</button>
    </div>
  );
}

export default Login;
