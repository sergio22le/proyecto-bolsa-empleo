// Este componente permite a los demandantes ver las ofertas disponibles y gestionar las ofertas en las que están inscritos.
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import OfertaDemandante from "./OfertaDemandante";

const OfertasDemandante = () => {
  const [ofertasDisponibles, setOfertasDisponibles] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [ofertasApuntado, setOfertasApuntado] = useState([]);

  const tokenUsuario = sessionStorage.getItem("token");

  const obtenerUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsuario(data.demandante);
      }
    } catch (e) {
      console.log("No se ha podido obtener los datos del usuario:", e.message);
    }
  };

  const obtenerOfertasApuntado = async (idUsuario) => {
    try {
      const response = await fetch(`${API_URL}/demandantes/${idUsuario}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOfertasApuntado(data.demandante.ofertas || []);
        return data.demandante.ofertas || [];
      }
    } catch (e) {
      console.log(e.message);
      return [];
    }
  };

  const obtenerOfertasDisponibles = async (idUsuario, ofertasYaApuntadas) => {
    try {
      const response = await fetch(`${API_URL}/demandantes/ofertas/${idUsuario}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const idsApuntados = ofertasYaApuntadas.map((oferta) => oferta.oferta.id);

        const ofertasFiltradas = data.ofertas.filter(
          (oferta) => oferta.abierta === 1 && !idsApuntados.includes(oferta.id)
        );

        setOfertasDisponibles(ofertasFiltradas);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const cargarDatos = async () => {
    await obtenerUsuario();
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    const cargarOfertas = async () => {
      if (usuario?.id) {
        const ofertasApuntadas = await obtenerOfertasApuntado(usuario.id);
        await obtenerOfertasDisponibles(usuario.id, ofertasApuntadas);
      }
    };

    cargarOfertas();
  }, [usuario]);

  const inscribirte = async (idOferta) => {
    try {
      const response = await fetch(`${API_URL}/ofertas/inscribir/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify({
          id_oferta: idOferta,
          id_demandante: usuario.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Te has inscrito en la oferta:", idOferta);

        setOfertasDisponibles((prev) => prev.filter((oferta) => oferta.id !== idOferta));

        const ofertaInscrita = ofertasDisponibles.find((oferta) => oferta.id === idOferta);

        if (ofertaInscrita) {
          setOfertasApuntado((prev) => [...prev, { oferta: ofertaInscrita }]);
        }
      } else {
        console.error("Error en la respuesta del servidor:", data.message || "Sin mensaje de error");
      }
    } catch (e) {
      console.error("Error al inscribirse:", e.message);
    }
  };

  const desinscribirte = async (idOferta) => {
    try {
      const response = await fetch(`${API_URL}/ofertas/desinscribir/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify({
          id_oferta: idOferta,
          id_demandante: usuario.id,
        }),
      });

      if (response.ok) {
        console.log("Te has desinscrito de la oferta:", idOferta);

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
};

export default OfertasDemandante;
