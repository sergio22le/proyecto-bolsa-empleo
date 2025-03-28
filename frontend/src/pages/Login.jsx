import { useState } from "react";
import "./Login.css";

function Login() {
  // Estados para demandante
  const [usuarioDemandante, setUsuarioDemandante] = useState("");
  const [passwordDemandante, setPasswordDemandante] = useState("");
  const [errorDemandante, setErrorDemandante] = useState("");

  // Estados para empresa
  const [usuarioEmpresa, setUsuarioEmpresa] = useState("");
  const [passwordEmpresa, setPasswordEmpresa] = useState("");
  const [errorEmpresa, setErrorEmpresa] = useState("");

  // Función para manejar el login de demandantes
  const handleSubmitDemandante = async (e) => {
    e.preventDefault();
    setErrorDemandante("");

    const response = await fetch("http://localhost:8000/login-demandante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: usuarioDemandante, password: passwordDemandante }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/home";
    } else {
      setErrorDemandante(data.message);
    }
  };

  // Función para manejar el login de empresas
  const handleSubmitEmpresa = async (e) => {
    e.preventDefault();
    setErrorEmpresa("");

    const response = await fetch("http://localhost:8000/login-empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: usuarioEmpresa, password: passwordEmpresa }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/home";
    } else {
      setErrorEmpresa(data.message);
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="login-container">
        {/* Formulario de Demandante */}
        <div className="form-demandante">
          <h3>Demandante</h3>
          {errorDemandante && <p style={{ color: "red" }}>{errorDemandante}</p>}
          <form className="login-form" onSubmit={handleSubmitDemandante}>
            <input
              type="text"
              placeholder="Usuario o Email"
              value={usuarioDemandante}
              onChange={(e) => setUsuarioDemandante(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordDemandante}
              onChange={(e) => setPasswordDemandante(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
          </form>
          <button className="register" onClick={() => (window.location.href = "/registroDemandante")}>
            Regístrate
          </button>
        </div>

        {/* Formulario de Empresa */}
        <div className="form-empresa">
          <h3>Empresa</h3>
          {errorEmpresa && <p style={{ color: "red" }}>{errorEmpresa}</p>}
          <form className="login-form" onSubmit={handleSubmitEmpresa}>
            <input
              type="text"
              placeholder="Email o CIF"
              value={usuarioEmpresa}
              onChange={(e) => setUsuarioEmpresa(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordEmpresa}
              onChange={(e) => setPasswordEmpresa(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
          </form>
          <button className="register" onClick={() => (window.location.href = "/registroEmpresa")}>
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
