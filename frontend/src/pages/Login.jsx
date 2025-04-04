import { useState } from "react";

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
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {

        const tokenUsuario = data.token;
        const idUsuario = data.id;
        const usuario = data.usuario;
        const tipoUsuario = data.tipo;

        if (tokenUsuario) {
          
          sessionStorage.setItem('idUsuario', idUsuario);
          sessionStorage.setItem('token', tokenUsuario);
          sessionStorage.setItem('usuario', usuario);
          sessionStorage.setItem('tipo', tipoUsuario);
  
        // Redireccionar a la página correspondiente
        window.location.href = `http://localhost:5173/home/${idUsuario}`;
        console.log(idUsuario);
      }
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
    </div>
  );
}

export default Login;
