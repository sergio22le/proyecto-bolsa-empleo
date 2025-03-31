import React, { useState } from "react";
import RegistroPaso1 from "../components/RegistroPaso1";
import RegistroPaso2 from "../components/RegistroPaso2";
import Footer from "../components/footer";
import Header from "../components/header";

const Registro = () => {
  const [tipoRegistro, setTipoRegistro] = useState(""); // Estado para tipoRegistro
  const [paso, setPaso] = useState(1); // Controla el paso del registro

  const avanzarPaso = (tipo) => {
    setTipoRegistro(tipo); // Establece el tipo de registro
    setPaso(2); // Cambia al segundo paso
  };

  return (
    <div className="container-registro">
      <Header />
      <div className="registro-body">
        {paso === 1 && <RegistroPaso1 onRegistroExitoso={avanzarPaso} />}
        {paso === 2 && <RegistroPaso2 tipoRegistro={tipoRegistro} />}
      </div>
      <Footer />
    </div>
  );
};

export default Registro;
