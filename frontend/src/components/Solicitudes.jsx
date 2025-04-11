// Este componente muestra las solicitudes asociadas a las ofertas de una empresa.

import { API_URL } from "../config";

import { useEffect, useState } from "react";
import Solicitud from "./Solicitud";

const Solicitudes = ({ usuario }) => {
    // Token del usuario almacenado en sessionStorage
    const tokenUsuario = sessionStorage.getItem("token");

    // Estado para almacenar las ofertas asociadas al usuario (empresa)
    const [ofertas, setOfertas] = useState([]);

    // Función para obtener las ofertas desde el backend
    const obtenerOfertas = async () => {
        try {
            const response = await fetch(`${API_URL}/ofertas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Filtrar las ofertas que pertenecen a la empresa del usuario y están abiertas
                const ofertasEmpresa = data.ofertas.filter(
                    (oferta) => oferta.id_emp === usuario.id && oferta.abierta === 1
                );
                setOfertas(ofertasEmpresa); // Almacenar las ofertas en el estado
            }
        } catch (e) {
            console.log("Error al obtener las ofertas:", e.message); // Manejar errores en la solicitud
        }
    };

    // useEffect para obtener las ofertas al montar el componente
    useEffect(() => {
        obtenerOfertas();
    }, []);

    // Callback para actualizar las ofertas después de adjudicar una solicitud
    const adjudicarOferta = () => {
        obtenerOfertas(); // Vuelve a cargar las ofertas desde el backend
    };

    return (
        <div className="container-solicitudes">
            <h2>Solicitudes</h2>
            {/* Renderizar las ofertas asociadas al usuario */}
            {ofertas.map((oferta) => (
                <Solicitud
                    key={oferta.id}
                    oferta={oferta} // Renderiza los postulantes asociados a la oferta
                    onAdjudicar={adjudicarOferta} // Pasa el callback al componente hijo
                />
            ))}
        </div>
    );
};

export default Solicitudes;