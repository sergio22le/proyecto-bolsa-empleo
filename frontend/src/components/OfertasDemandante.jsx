// Este componente permite a los demandantes ver las ofertas disponibles y gestionar las ofertas en las que están inscritos.
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import OfertaDemandante from "./OfertaDemandante";

const OfertasDemandante = () => {
  // Estado para almacenar las ofertas disponibles para el demandante
  const [ofertasDisponibles, setOfertasDisponibles] = useState([]);

  // Estado para almacenar los datos del usuario (demandante)
  const [usuario, setUsuario] = useState({});

  // Estado para almacenar las ofertas en las que el usuario está inscrito
  const [ofertasApuntado, setOfertasApuntado] = useState([]);

  // Token del usuario almacenado en sessionStorage
  const tokenUsuario = sessionStorage.getItem("token");

  // Función para obtener los datos del usuario desde el backend
  const obtenerUsuario = async () => {
    try {
      const response = await fetch (`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsuario(data.demandante); // Almacenar los datos del usuario
      }
    } catch (e) {
      console.log("No se ha podido obtener los datos del usuario:", e.message);
    }
  };

  // Función para obtener las ofertas disponibles desde el backend
  const obtenerOfertas = async () => {
    if (!usuario.id) return;
    try {
      const response = await fetch(
        `${API_URL}/demandantes/ofertas/${usuario.id}`,
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
        // Filtrar las ofertas abiertas
        setOfertasDisponibles(
          data.ofertas.filter((oferta) => oferta.abierta === 1)
        );
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // Función para obtener las ofertas en las que el usuario está inscrito
  const obtenerOfertasApuntado = async () => {
    if (!usuario.id) return;

    try {
      const response = await fetch(
        `${API_URL}/demandantes/${usuario.id}`,
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
        setOfertasApuntado(data.demandante.ofertas); // Almacenar las ofertas inscritas
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const inscribirte = async (idOferta) => {
    try {
      // Registrar las variables clave
      console.log("API_URL:", API_URL);
      console.log("Token del usuario:", tokenUsuario);
      console.log("ID del demandante:", usuario?.id);
      console.log("ID de la oferta:", idOferta);
  
      // Realizar la solicitud al backend
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
  
      // Registrar la respuesta completa del servidor
      console.log("Respuesta completa del servidor:", response);
  
      // Intentar convertir la respuesta a JSON
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);
  
      if (response.ok) {
        console.log("Te has inscrito en la oferta:", idOferta);
  
        // Actualizar las ofertas disponibles y las ofertas inscritas
        setOfertasDisponibles((prev) =>
          prev.filter((oferta) => oferta.id !== idOferta)
        );
  
        const ofertaInscrita = ofertasDisponibles.find(
          (oferta) => oferta.id === idOferta
        );
  
        if (ofertaInscrita) {
          setOfertasApuntado((prev) => [...prev, { oferta: ofertaInscrita }]);
        }
      } else {
        console.error("Error en la respuesta del servidor:", data.message || "Sin mensaje de error");
      }
    } catch (e) {
      // Registrar cualquier error que ocurra
      console.error("Error al inscribirse:", e.message);
    }
  };

  // Función para desinscribirse de una oferta
  const desinscribirte = async (idOferta) => {
    try {
      const response = await fetch(
        `${API_URL}/ofertas/desinscribir/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUsuario}`,
          },
          body: JSON.stringify({
            id_oferta: idOferta,
            id_demandante: usuario.id,
          }),
        }
      );

      if (response.ok) {
        console.log("Te has desinscrito de la oferta:", idOferta);

        // Actualizar las ofertas inscritas y las ofertas disponibles
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

  // useEffect para cargar los datos iniciales al montar el componente
  useEffect(() => {
    obtenerUsuario();
  }, []);

  // useEffect para cargar las ofertas cuando se obtienen los datos del usuario
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
};

export default OfertasDemandante;
