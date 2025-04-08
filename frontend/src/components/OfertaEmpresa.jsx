import { useState } from "react";

const OfertaEmpresa = ({ oferta }) => {
  const tokenUsuario = sessionStorage.getItem("token");
  const [estado, setEstado] = useState(oferta.abierta === 1 ? "abierta" : "cerrada");

  const cerrarOferta = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/ofertas/cerrar/${oferta.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      if (response.ok) {
        console.log("Oferta cerrada correctamente");
        setEstado("cerrada");
      } else {
        console.error("Error al cerrar la oferta: ", response.statusText);
      }
    } catch (e) {
      console.error("Error al cerrar la oferta:", e.message);
    }
  };

  if (estado === "cerrada") {
    return null;
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
          <button onClick={cerrarOferta}>Cerrar oferta</button>
        </div>
      </div>
    </div>
  );
};

export default OfertaEmpresa;