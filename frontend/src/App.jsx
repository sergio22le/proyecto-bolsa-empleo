import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DetalleOferta from "./pages/DetalleOferta";
import Perfil from "./components/Perfil";
import Home from "./pages/Home";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path='/home/:id' element={<Home />} />
        <Route path="/detalleOferta/:id" element={<DetalleOferta />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;