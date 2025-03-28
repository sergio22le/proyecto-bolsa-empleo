import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegistroDemandante from "./pages/RegistroDemandante";
import RegistroEmpresa from "./pages/RegistroEmpresa";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registroDemandante" element={<RegistroDemandante />} />
        <Route path="/registroEmpresa" element={<RegistroEmpresa />} />
      </Routes>
    </Router>
  );
}

export default App;

