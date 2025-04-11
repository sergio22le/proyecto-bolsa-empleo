// Este componente permite a las empresas gestionar sus ofertas y buscar candidatos para inscribirlos.

import { useEffect, useState } from "react";
import { API_URL } from "../config";

const Demandantes = ({ usuario }) => {
    // Estado para almacenar las ofertas abiertas de la empresa
    const [ofertas, setOfertas] = useState([]);

    // Estado para controlar si los datos están cargando
    const [cargando, setCargando] = useState(true);

    // Estado para almacenar la oferta seleccionada
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

    // Estado para almacenar los candidatos disponibles para una oferta
    const [candidatos, setCandidatos] = useState([]);

    // Token del usuario almacenado en sessionStorage
    const tokenUsuario = sessionStorage.getItem("token");

    // Función para obtener las ofertas abiertas de la empresa desde el backend
    const getOfertas = async () => {
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
                // Filtrar las ofertas abiertas de la empresa
                const misOfertas = data.ofertas.filter(
                    (oferta) => oferta.id_emp === usuario.id && oferta.abierta === 1
                );

                setOfertas(misOfertas);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    // Función para obtener los candidatos disponibles para una oferta
    const getCandidatos = async (idOferta) => {
        try {
            const response = await fetch(
                `${API_URL}/ofertas/candidatos/${idOferta}`,
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
                const misCandidatos = data.candidatos;
                const misPostulantes = await getPostulantes(idOferta);

                // Filtrar los candidatos que no están inscritos en la oferta
                const candidatosFiltrados = misCandidatos.filter((candidato) => {
                    return !misPostulantes.some(
                        (postulante) => postulante.id === candidato.id
                    );
                });

                setCandidatos(candidatosFiltrados);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    // Función para obtener los postulantes ya inscritos en una oferta
    const getPostulantes = async (idOferta) => {
        try {
            const response = await fetch(
                `${API_URL}/ofertas/postulantes/${idOferta}`,
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
                return data.postulantes;
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    // Función para inscribir a un demandante en una oferta
    const inscribirDemandante = async (idDemandante, idOferta) => {
        try {
            const response = await fetch(
                `${API_URL}/ofertas/inscribir`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenUsuario}`,
                    },
                    body: JSON.stringify({ id_demandante: idDemandante, id_oferta: idOferta }),
                }
            );

            if (response.ok) {
                // Actualizar la lista de candidatos después de inscribir a uno
                await getCandidatos(idOferta);
            } else {
                console.error("Error al inscribir al demandante.");
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    // Función para buscar candidatos para una oferta específica
    const buscarCandidatos = (idOferta) => {
        setOfertaSeleccionada(idOferta);
        getCandidatos(idOferta);
    };

    // useEffect para cargar las ofertas al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            await getOfertas();
            setCargando(false);
        };

        cargarDatos();
    }, []);

    return (
        <div>
            {cargando ? (
                <h2 className="cargando">Cargando...</h2>
            ) : (
                <div className="mis-ofertas">
                    <h2>Mis Ofertas</h2>
                    {ofertas.map((oferta) => (
                        <div key={oferta.id} className="oferta">
                            <div className="oferta-info">
                                <div>
                                    <h3>Id oferta</h3>
                                    <p>{oferta.id}</p>
                                </div>
                                <div>
                                    <h3>Fecha publicación</h3>
                                    <p>{oferta.fecha_pub}</p>
                                </div>
                                <div>
                                    <h3>Oferta</h3>
                                    <p>{oferta.nombre}</p>
                                </div>
                                <button onClick={() => buscarCandidatos(oferta.id)}>
                                    Buscar candidatos
                                </button>
                            </div>
                            {ofertaSeleccionada === oferta.id && (
                                <div className="candidatos">
                                    <h3>Candidatos para esta oferta:</h3>
                                    {candidatos.length > 0 ? (
                                        candidatos.map((demandante) => (
                                            <div
                                                key={demandante.id}
                                                className="lista-candidatos"
                                            >
                                                <div className="candidato-info">
                                                    <p>
                                                        <span className="destacado">Nombre:</span>{" "}
                                                        {demandante.nombre} {demandante.ape1}{" "}
                                                        {demandante.ape2}
                                                    </p>
                                                    <p>
                                                        <span className="destacado">Teléfono:</span>{" "}
                                                        {demandante.tel_movil}
                                                    </p>
                                                    <p>
                                                        <span className="destacado">
                                                            Situación laboral:
                                                        </span>{" "}
                                                        {demandante.situacion === 0
                                                            ? "En paro"
                                                            : "Trabajando"}
                                                    </p>
                                                    <div>
                                                        <button
                                                            onClick={() =>
                                                                inscribirDemandante(
                                                                    demandante.id,
                                                                    oferta.id
                                                                )
                                                            }
                                                        >
                                                            Inscribir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay candidatos disponibles para esta oferta.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Demandantes;