import React from "react";
import "./Empresa.css";

const Empresa = () => {
    return (
        <div className="container-empresa">
            <div className="div-empresa">
                <p className="fecha-registro">Fecha registro</p>
                <p className="empresa">Empresa</p>
            </div>
            <div className="div-boton">
                <button className="boton-aceptar">Aceptar</button>
            </div>
        </div>
    );
};

export default Empresa;