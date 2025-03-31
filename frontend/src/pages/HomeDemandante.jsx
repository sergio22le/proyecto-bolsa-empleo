import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Oferta from "../components/Oferta";
import "./HomeDemandante.css";

function HomeDemandante() {

  return (
    <div>
      <Header />
      <h1>Ofertas de trabajo</h1>
      <Oferta />
      <Footer />
    </div>
  );
}

export default HomeDemandante;
