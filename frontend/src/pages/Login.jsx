
import { API_URL } from "../config";
import { useState } from "react";

function Login() {
  // Estado para almacenar el nombre de usuario ingresado
  const [usuario, setUsuario] = useState("");

  // Estado para almacenar la contraseña ingresada
  const [password, setPassword] = useState("");

  // Estado para manejar errores (como credenciales incorrectas o problemas del servidor)
  const [error, setError] = useState("");

  // Función para manejar el inicio de sesión
  const login = async (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    setError(""); // Limpiar errores previos

    try {
      // Realizar la solicitud al backend para autenticar al usuario
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }), // Enviar el usuario y la contraseña
      });

      const data = await response.json();

      if (response.ok) {
        // Si la autenticación es exitosa, obtener los datos del usuario
        const tokenUsuario = data.token;
        const idUsuario = data.id;
        const usuario = data.usuario;
        const tipoUsuario = data.tipo;

        if (tokenUsuario) {
          // Guardar los datos del usuario en el almacenamiento de sesión
          sessionStorage.setItem("idUsuario", idUsuario);
          sessionStorage.setItem("token", tokenUsuario);
          sessionStorage.setItem("usuario", usuario);
          sessionStorage.setItem("tipo", tipoUsuario);

          // Redirigir al usuario a la página principal
          window.location.href = `http://localhost:5173/home`;
          console.log(idUsuario);
        }
      } else {
        // Si hay un error en las credenciales, mostrar el mensaje de error
        setError(data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      // Manejar errores de conexión o del servidor
      console.error("Error en la solicitud:", error);
      setError("Error en el servidor");
    }
  };

  return (
    <section className="login">
      <div className="login-body">
        <h2>Iniciar Sesión</h2>
        <div className="login-container">
          <h3>Introducir datos</h3>
          {/* Mostrar mensaje de error si existe */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form className="form-login" onSubmit={login}>
            {/* Campo para ingresar el nombre de usuario */}
            <div>
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            {/* Campo para ingresar la contraseña */}
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Botón para enviar el formulario */}
            <button className="iniciar-sesion" type="submit">
              Iniciar sesión
            </button>
          </form>
          <div className="boton-registro">
            {/* Botón para redirigir al formulario de registro */}
            <button
              className="registro"
              onClick={() => (window.location.href = "/registro")}
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
