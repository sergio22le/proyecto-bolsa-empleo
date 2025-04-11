// Este componente representa la página principal para los demandantes.
import { API_URL } from "../config.js";

import { useEffect, useState } from "react";

import Perfil from "../components/Perfil.jsx";
import OfertasDemandante from "../components/OfertasDemandante.jsx";
import Titulos from "../components/Titulos.jsx";

const HomeDemandante = () => {
    // Estado para controlar la función seleccionada (ver ofertas, actualizar perfil, etc.)
    const [funcion, setFuncion] = useState("verOfertas");

    // Estado para almacenar los datos del usuario (demandante)
    const [usuario, setUsuario] = useState(null);

    // Estado para almacenar el ID del demandante
    const [idDemandante, setIdUsuario] = useState(null);

    // Token del usuario almacenado en sessionStorage
    const tokenUsuario = sessionStorage.getItem("token");

    // Función para obtener los datos del usuario desde el backend
    const obtenerUsuario = async () => {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Si la solicitud es exitosa, almacenar los datos del usuario
                setUsuario(data.demandante);
                setIdUsuario(data.usuario.id);
            }
        } catch (e) {
            // Manejar errores en la solicitud
            console.log(e.message);
        }
    };

    // useEffect para obtener los datos del usuario al cargar el componente
    useEffect(() => {
        obtenerUsuario();
    }, []);

    // Objeto que mapea las funciones seleccionadas a los componentes correspondientes
    const estadoFuncion = usuario
        ? {
              verOfertas: <OfertasDemandante />, // Componente para ver ofertas disponibles
              actualizarPerfil: <Perfil key={idDemandante} usuario={usuario} />, // Componente para actualizar el perfil
              actualizarTitulos: <Titulos key={idDemandante} usuario={usuario} />, // Componente para gestionar títulos
          }
        : null;

    return (
        <section className="section-funciones">
            {/* Opciones de funciones disponibles */}
            <div className="funciones">
                <div
                    className="ver-ofertas"
                    onClick={() => setFuncion("verOfertas")}
                >
                    <h4>Ver ofertas</h4>
                </div>
                <div
                    className="actualizar-perfil"
                    onClick={() => setFuncion("actualizarPerfil")}
                >
                    <h4>Actualizar Perfil</h4>
                </div>
                <div
                    className="actualizarTitulos"
                    onClick={() => setFuncion("actualizarTitulos")}
                >
                    <h4>Mis títulos</h4>
                </div>
            </div>
            {/* Renderizar el componente correspondiente a la función seleccionada */}
            <div className="funcion-actual">
                {estadoFuncion ? estadoFuncion[funcion] : <p>Cargando...</p>}
            </div>
        </section>
    );
};

export default HomeDemandante;