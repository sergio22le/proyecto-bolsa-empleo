// Este componente muestra los postulantes asociados a una oferta y permite adjudicar o rechazar postulantes.

import { API_URL } from "../config";

import { useEffect, useState } from "react";

const Solicitud = ({ oferta, onAdjudicar }) => {
  // Token del usuario almacenado en sessionStorage
  const tokenUsuario = sessionStorage.getItem("token");

  // Estado para almacenar los postulantes asociados a la oferta
  const [postulantes, setPostulantes] = useState([]);

  // Función para obtener los postulantes de una oferta desde el backend
  const obtenerPostulantes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/ofertas/postulantes/${oferta.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUsuario}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Filtrar los postulantes que no han sido adjudicados
        const postulantesSinAdjudicar = data.postulantes.filter(
          (postulante) => postulante.adjudicada === "No"
        );
        setPostulantes(postulantesSinAdjudicar); // Almacenar los postulantes en el estado
        console.log("Postulantes sin adjudicar:", postulantesSinAdjudicar);
      } else {
        console.error("Error al obtener los postulantes:", response.statusText);
      }
    } catch (e) {
      console.error("Error al obtener los postulantes:", e.message);
    }
  };

  // Función para adjudicar una oferta a un demandante
  const adjudicarOferta = async (idDemandante) => {
    try {
      const response = await fetch(
        `${API_URL}/ofertas/adjudicar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUsuario}`,
          },
          body: JSON.stringify({ id_oferta: oferta.id, id_demandante: idDemandante }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Oferta adjudicada correctamente", data);
        obtenerPostulantes(); // Volver a cargar los postulantes después de adjudicar
        onAdjudicar(); // Llamar al callback para actualizar la lista de postulantes
      } else {
        console.error("Error al adjudicar la oferta:", response.statusText);
      }
    } catch (e) {
      console.error("Error al adjudicar la oferta:", e.message);
    }
  };

  // useEffect para obtener los postulantes al montar el componente
  useEffect(() => {
    obtenerPostulantes();
  }, []);

  useEffect(() => {
    console.log("Postulantes actualizados:", postulantes);
  }, [postulantes]); 

  return (
    <div className="container-solicitud">
      <div className="info-principal">
        <h4>ID: {oferta.id}</h4>
        <h2>{oferta.nombre}</h2>
      </div>
      {/* Renderizar la lista de postulantes */}
      {postulantes.length > 0 ? (
        postulantes.map((postulante) => (
          <div key={postulante.demandante.id} className="info-solicitud">
            <div>
              <h3>Datos demandante</h3>
              <div className="datos-demandante">
                <p>
                  {postulante.demandante.nombre} {postulante.demandante.ape1}{" "}
                  {postulante.demandante.ape2}
                </p>
                <p>Email: {postulante.demandante.email}</p>
                <p>Teléfono: {postulante.demandante.tel_movil}</p>
                {postulante.demandante.situacion === 0 ? (
                  <p>Situación: En paro</p>
                ) : (
                  <p>Situación: Trabajando</p>
                )}
              </div>
            </div>
            <div className="botones-solicitud">
              {/* Botón para aceptar al postulante */}
              <button onClick={() => adjudicarOferta(postulante.demandante.id)}>
                Aceptar
              </button>
              {/* Botón para rechazar al postulante */}
              <button className="rechazar">Rechazar</button>
            </div>
          </div>
        ))
      ) : (
        // Mostrar mensaje si no hay postulantes disponibles
        <p>No hay postulantes disponibles</p>
      )}
    </div>
  );
};

export default Solicitud;