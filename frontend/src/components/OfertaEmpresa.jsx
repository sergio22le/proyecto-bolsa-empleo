// Este componente representa una oferta individual creada por una empresa y permite gestionarla.

import { API_URL } from "../config";

import { useState } from "react";

const OfertaEmpresa = ({ oferta }) => {
  // Token del usuario almacenado en sessionStorage
  const tokenUsuario = sessionStorage.getItem("token");

  // Estado para controlar si la oferta está abierta o cerrada
  const [estado, setEstado] = useState(oferta.abierta === 1 ? "abierta" : "cerrada");

  // Función para cerrar una oferta
  const cerrarOferta = async () => {
    try {
      const response = await fetch(`${API_URL}/ofertas/cerrar/${oferta.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      if (response.ok) {
        // Cambiar el estado de la oferta a "cerrada"
        setEstado("cerrada");
      } else {
        console.error("Error al cerrar la oferta: ", response.statusText);
      }
    } catch (e) {
      console.error("Error al cerrar la oferta:", e.message);
    }
  };

  // Si la oferta está cerrada, no se renderiza
  if (estado === "cerrada") {
    return null;
  }

  return (
    <div className="container-oferta">
      <div className="condiciones-oferta">
        {/* Mostrar la fecha de publicación */}
        <div className="container-fecha-publi">
          <h4>Fecha publicación</h4>
          <p className="fecha-publi">{oferta.fecha_pub}</p>
        </div>
        {/* Mostrar el nombre de la oferta */}
        <div className="container-nombre-oferta">
          <h4>Oferta</h4>
          <p className="nombre-oferta">{oferta.nombre}</p>
        </div>
        {/* Mostrar el tipo de contrato */}
        <div className="container-tipo-cont">
          <h4>Tipo de contrato</h4>
          <p className="tipo-cont">{oferta.tipo_cont}</p>
        </div>
        {/* Mostrar el número de puestos disponibles */}
        <div className="container-num-puesto">
          <h4>Nº de puestos</h4>
          <p className="num-puesto">{oferta.num_puesto}</p>
        </div>
        {/* Botón para cerrar la oferta */}
        <div className="botones">
          <button onClick={cerrarOferta}>Cerrar oferta</button>
        </div>
      </div>
    </div>
  );
};

export default OfertaEmpresa;