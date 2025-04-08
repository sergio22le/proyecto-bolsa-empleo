import { useState } from "react";

const OfertaDemandante = ({ oferta }) => {

  const [acciones, setAcciones] = useState("oculto");
  
    const mostrarAcciones = () => {
      setAcciones("visible");
    }
  
    return (
      <div className="container-oferta">
        <div className="condiciones-oferta">
          <div className="container-fecha-publi">
            <h4>Fecha publicación</h4>
            <p className="fecha-publi">{oferta.fecha_pub}</p>
          </div>
          <div className="container-nombre-oferta">
            <h4>Oferta</h4>
            <p className="nombre-oferta">{oferta.nombre}</p>
          </div>
          <div className="container-tipo-cont">
            <h4>Tipo de contrato</h4>
            <p className="tipo-cont">{oferta.tipo_cont}</p>
          </div>
          <div className="container-num-puesto">
            <h4>Nº de puestos</h4>
            <p className="num-puesto">{oferta.num_puesto}</p>
          </div>
          <div className="botones">
            <button onClick={()=>mostrarAcciones}>Acciones</button>
          </div>
        </div>
        {acciones === "oculto" ? (
          <div></div>
        ) : (
          <div className="botones-oferta">
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    );
  };

export default OfertaDemandante;