import { useEffect, useState } from "react";
import OfertaDemandante from "./OfertaDemandante";

const OfertasDemandante = () => {
  const [ofertasDisponibles, setOfertasDisponibles] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [ofertasApuntado, setOfertasApuntado] = useState([]);

  const tokenUsuario = sessionStorage.getItem("token");

  // Obtener datos del usuario
  const obtenerUsuario = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsuario(data.demandante);
        console.log("Obtenidos datos del usuario:", data.demandante);
      }
    } catch (e) {
      console.log("No se ha podido obtener los datos del usuario:", e.message);
    }
  };

  // Obtener ofertas disponibles
  const obtenerOfertas = async () => {
    if (!usuario.id) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/demandantes/ofertas/${usuario.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenUsuario}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOfertasDisponibles(
          data.ofertas.filter((oferta) => oferta.abierta === 1)
        );
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // Obtener ofertas a las que el usuario está apuntado
  const obtenerOfertasApuntado = async () => {
    if (!usuario.id) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/demandantes/${usuario.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenUsuario}`,
          },
        }
      );

      const data = await response.json();
      console.log("Datos de ofertas apuntadas:", data.demandante.ofertas);

      if (response.ok) {
        setOfertasApuntado(data.demandante.ofertas);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // Función para inscribirse en una oferta
  const inscribirte = async (idOferta) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/ofertas/inscribir/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenUsuario}`,
          },
          body: JSON.stringify({
            id_oferta: idOferta,
            id_demandante: usuario.id,
          }),
        }
      );

      if (response.ok) {
        console.log("Te has inscrito en la oferta:", idOferta);

        // Actualizar estados
        setOfertasDisponibles((prev) =>
          prev.filter((oferta) => oferta.id !== idOferta)
        );

        const ofertaInscrita = ofertasDisponibles.find(
          (oferta) => oferta.id === idOferta
        );

        if (ofertaInscrita) {
          setOfertasApuntado((prev) => [...prev, { oferta: ofertaInscrita }]);
        }
      }
    } catch (e) {
      console.log("Error al inscribirse:", e.message);
    }
  };

  // Función para desinscribirse de una oferta
  const desinscribirte = async (idOferta) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/ofertas/desinscribir/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenUsuario}`,
          },
          body: JSON.stringify({
            id_oferta: idOferta,
            id_demandante: usuario.id,
          }),
        }
      );

      if (response.ok) {
        console.log("Te has desinscrito de la oferta:", idOferta);

        // Actualizar estados
        const ofertaDesinscrita = ofertasApuntado.find(
          (oferta) => oferta.oferta.id === idOferta
        );

        if (ofertaDesinscrita) {
          setOfertasApuntado((prev) =>
            prev.filter((oferta) => oferta.oferta.id !== idOferta)
          );

          setOfertasDisponibles((prev) => [
            ...prev,
            ofertaDesinscrita.oferta,
          ]);
        }
      }
    } catch (e) {
      console.log("Error al desinscribirse:", e.message);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    obtenerUsuario();
  }, []);

  useEffect(() => {
    if (usuario.id) {
      obtenerOfertas();
      obtenerOfertasApuntado();
    }
  }, [usuario]);

  return (
    <div className="container-ofertas">
      {ofertasApuntado.length > 0 && (
        <>
          <h2>Ofertas Apuntadas</h2>
          {ofertasApuntado.map((oferta) => (
            <OfertaDemandante
              key={oferta.oferta.id}
              oferta={oferta.oferta}
              accion={() => desinscribirte(oferta.oferta.id)}
              apuntada={true}
            />
          ))}
        </>
      )}
      {ofertasDisponibles.length > 0 ? (
        <>
          <h2>Ofertas Disponibles</h2>
          {ofertasDisponibles.map((oferta) => (
            <OfertaDemandante
              key={oferta.id}
              oferta={oferta}
              accion={() => inscribirte(oferta.id)}
            />
          ))}
        </>
      ) : (
        <h2 className="info">No hay ofertas disponibles</h2>
      )}
    </div>
  );
}

export default OfertasDemandante;