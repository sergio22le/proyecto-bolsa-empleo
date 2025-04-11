// Este componente representa la página principal para las empresas.

import { API_URL } from "../config";

import { useEffect, useState } from "react";

import Solicitudes from "../components/Solicitudes";
import Demandantes from "../components/Demandantes";
import OfertasEmpresa from "../components/OfertasEmpresa";

const HomeEmpresa = () => {
    // Estado para controlar la función seleccionada (crear ofertas, consultar solicitudes, etc.)
    const [funcion, setFuncion] = useState("crearOfertas");

    // Estado para almacenar los datos del usuario (empresa)
    const [usuario, setUsuario] = useState({});

    // Estado para controlar si los datos están cargando
    const [cargando, setCargando] = useState(true);

    // Token del usuario almacenado en sessionStorage
    const tokenUsuario = sessionStorage.getItem("token");

    // Función para obtener los datos del usuario desde el backend
    const obtenerDatosUsuario = async () => {
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
                setUsuario(data.empresa);
                console.log("Obtenidos datos del usuario:", data.empresa);
            }
        } catch (e) {
            // Manejar errores en la solicitud
            console.log("No se ha podido obtener los datos del usuario:", e.message);
        } finally {
            // Finalizar el estado de carga
            setCargando(false);
        }
    };

    // useEffect para obtener los datos del usuario al cargar el componente
    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    // Objeto que mapea las funciones seleccionadas a los componentes correspondientes
    const estadoFuncion = {
        crearOfertas: <OfertasEmpresa key={usuario.id} usuario={usuario} />,
        consultarSolicitudes: <Solicitudes key={usuario.id} usuario={usuario} />,
        consultarDemandantes: <Demandantes key={usuario.id} usuario={usuario} />,
    };

    // Mostrar un mensaje de carga mientras se obtienen los datos del usuario
    if (cargando) {
        return (
            <section className="section-funciones">
                <h2 className="cargando">Cargando...</h2>
            </section>
        );
    }

    return (
        <section className="section-funciones">
            {/* Verificar si el usuario está validado */}
            {usuario.validado === 1 ? (
                <>
                    {/* Opciones de funciones disponibles */}
                    <div className="funciones">
                        <div
                            className="crear-oferta"
                            onClick={() => setFuncion("crearOfertas")}
                        >
                            <h4>Mis ofertas</h4>
                        </div>
                        <div
                            className="consultar-solicitudes"
                            onClick={() => setFuncion("consultarSolicitudes")}
                        >
                            <h4>Consultar solicitudes</h4>
                        </div>
                        <div
                            className="consultar-demandantes"
                            onClick={() => setFuncion("consultarDemandantes")}
                        >
                            <h4>Consultar demandantes</h4>
                        </div>
                    </div>
                    {/* Renderizar el componente correspondiente a la función seleccionada */}
                    <div className="funcion-actual">{estadoFuncion[funcion]}</div>
                </>
            ) : (
                // Mostrar mensaje si el usuario no está validado
                <div className="pendiente-validacion">
                    <h2>Pendiente de validación por parte del administrador</h2>
                </div>
            )}
        </section>
    );
};

export default HomeEmpresa;