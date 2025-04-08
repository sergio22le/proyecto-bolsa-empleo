import { useEffect, useState } from "react";

const Solicitud = ({ oferta }) => {
  const tokenUsuario = sessionStorage.getItem("token");

  const [postulantes, setPostulantes] = useState([]);

  const obtenerPostulantes = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/ofertas/postulantes/${oferta.id}`,
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
        setPostulantes(data.postulantes);
      } else {
        console.error("Error al obtener los postulantes:", response.statusText);
      }
    } catch (e) {
      console.error("Error al obtener los postulantes:", e.message);
    }
  };

  const adjudicarOferta = async (idDemandante) => {
    try {
        const response = await fetch(`http://localhost:8000/api/ofertas/adjudicar`,{
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${tokenUsuario}`,
            },
            body: JSON.stringify({ id_oferta: oferta.id, id_demandante: idDemandante })
          }
        );

        console.log(oferta.id, idDemandante);
  
        const data = await response.json();
  
        if (response.ok) {
          console.log("Oferta adjudicada correctamente", data);
        } else {
          console.error("Error al obtener los postulantes:", response.statusText);
        }
      } catch (e) {
        console.error("Error al obtener los postulantes:", e.message);
      }
  }

  useEffect(() => {
    obtenerPostulantes();
  }, []);

  return (
    <div className="container-solicitud">
      <div className="info-principal">
        <h4>ID: {oferta.id}</h4>
        <h2>{oferta.nombre}</h2>
      </div>
      {postulantes.length > 0 ? (
        postulantes.map((postulante) => (
          <div key={postulante.demandante.id} className="info-solicitud">
            <div>
              <h3>Datos demandante</h3>
              <div className="datos-demandante">
                <p>{postulante.demandante.nombre} {postulante.demandante.ape1} {postulante.demandante.ape2}</p>
              <p>Email: {postulante.demandante.email}</p>
              <p>Teléfono: {postulante.demandante.tel_movil}</p>
              {postulante.demandante.situacion === 0 ? (
                <p>Situacion: En paro</p>
              ) : (
                <p>Situacion: Trabajando</p>
              )}
              </div>
            </div>
            <div className="botones-solicitud">
              <button onClick={() => adjudicarOferta(postulante.demandante.id)}>Aceptar</button>
              <button className="rechazar">Rechazar</button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay postulantes disponibles</p>
      )}
    </div>
  );
};

export default Solicitud;