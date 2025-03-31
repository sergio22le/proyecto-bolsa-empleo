import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DetalleOferta from "./pages/DetalleOferta";
import Perfil from "./pages/Perfil";
import HomeDemandante from "./pages/HomeDemandante";
import HomeEmpresa from "./pages/HomeEmpresa";
import HomeAdmin from "./pages/HomeAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/homeDemandante" element={<HomeDemandante />} />
        <Route path="/homeEmpresa" element={<HomeEmpresa />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/detalleOferta" element={<DetalleOferta />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;