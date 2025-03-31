import React from "react";
import "./DetalleOferta.css";
import Header from "../components/header";
import Footer from "../components/footer";

const DetalleOferta = () => {
    return (
        <div className="detalle-oferta">
            <Header />
                <div className="body-detalle-oferta">
                    <h1>Detalle oferta</h1>
                    <div className="container-detalle-oferta">
                        <div className="datos-oferta">
                            <div className="nombre">
                                <h3>Oferta</h3>
                                <p>Nombre oferta</p>
                            </div>
                            <div className="empresa">
                                <h3>Empresa</h3>
                                <p>Nombre empresa</p>
                            </div>
                            <div className="descripcion">
                                <h3>Descripción</h3>
                                <p>Descripción de la oferta</p>
                            </div>
                            <div className="contrato">
                                <h3>Tipo de contrato</h3>
                                <p>Tipo de contrato</p>
                            </div>
                            <div className="fecha-publi">
                                <h3>Fecha de publicación</h3>
                                <p>Fecha</p>
                            </div>
                            <div className="fecha-cierre">
                                <h3>Fecha de cierrre</h3>
                                <p>Fecha</p>
                            </div>
                            <div className="n-puestos">
                                <h3>Número de vacantes</h3>
                                <p>Nº</p>
                            </div>
                            <div className="horario">
                                <h3>Horario</h3>
                                <p>horario</p>
                            </div>
                        </div>
                        <div className="boton-apuntarme">
                            <button><a>Apuntarme</a></button>
                        </div>
                    </div>
                    <a className="volver" href="/home">Volver</a>
                </div>
            <Footer />
        </div>
    );
}

export default DetalleOferta;