import { useEffect, useState } from "react";

const Demandantes = ({ usuario }) => {
    const [ofertas, setOfertas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null); // Estado para la oferta seleccionada
    const [candidatos, setCandidatos] = useState([]);

    const tokenUsuario = sessionStorage.getItem("token");

    const getOfertas = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/ofertas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();
            console.log("GET OFERTAS: ", data.ofertas);

            if (response.ok) {
                const misOfertas = data.ofertas.filter((oferta) => oferta.id_emp === usuario.id && oferta.abierta === 1);
                console.log("Ofertas del usuario: ", misOfertas);

                if (misOfertas.length === 0) {
                    console.log("No tienes ofertas abiertas.");
                }
                console.log("Mis ofertas: ", misOfertas);
                setOfertas(misOfertas);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const getCandidatos = async (idOferta) => {
        try {
            const response = await fetch(`http://localhost:8000/api/ofertas/candidatos/${idOferta}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            console.log("GET CANDIDATOS: ", data);

            if (response.ok) {
                const misCandidatos = data.candidatos; // Lista de candidatos que encajan con la oferta
                const misPostulantes = await getPostulantes(idOferta); // Lista de postulantes ya inscritos
    
                // Filtrar los candidatos que no están en la lista de postulantes
                const candidatosFiltrados = misCandidatos.filter((candidato) => {
                    return !misPostulantes.some((postulante) => postulante.id === candidato.id);
                });
    
                console.log("Candidatos filtrados: ", candidatosFiltrados);
                setCandidatos(candidatosFiltrados);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const getPostulantes = async (idOferta) => {
        try {
            const response = await fetch(`http://localhost:8000/api/ofertas/postulantes/${idOferta}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                if (data.postulantes.length === 0) {
                    console.log("No hay postulantes para esta oferta.");
                    return [];
                }
                console.log(`Oferta ${idOferta}, Postulantes para la oferta: `, data.postulantes);
                return data.postulantes;
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const inscribirDemandante = async (idDemandante, idOferta) => {
        try {
            const response = await fetch(`http://localhost:8000/api/ofertas/inscribir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
                body: JSON.stringify({ id_demandante: idDemandante, id_oferta: idOferta }),
            });
    
            if (response.ok) {
                console.log(`Demandante ${idDemandante} inscrito en la oferta ${idOferta}`);
                alert("Demandante inscrito correctamente.");
                // Vuelve a obtener los candidatos después de inscribir
                await getCandidatos(idOferta);
            } else {
                console.error("Error al inscribir al demandante.");
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const buscarCandidatos = (idOferta) => {
        setOfertaSeleccionada(idOferta); 
        getCandidatos(idOferta);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            await getOfertas();
            setCargando(false);
        };

        cargarDatos();
    }, []);

    useEffect(() => {
        console.log("Ofertas: ", ofertas);
    }, [cargando]);

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
                                    <h3>Fecha publicacion</h3>
                                    <p>{oferta.fecha_pub}</p>
                                </div>
                                <div>
                                    <h3>Oferta</h3>
                                    <p>{oferta.nombre}</p>
                                </div>
                                <button onClick={() => buscarCandidatos(oferta.id)}>Buscar candidatos</button>
                            </div>
                            {ofertaSeleccionada === oferta.id && (
                                <div className="candidatos">
                                    <h3>Candidatos para esta oferta:</h3>
                                    {candidatos.length > 0 ? (
                                        candidatos.map((demandante) => (
                                            <div key={demandante.id} className="lista-candidatos">
                                                <div className="candidato-info">
                                                    <p><span className="destacado">Nombre:</span> {demandante.nombre} {demandante.ape1} {demandante.ape2}</p>
                                                    <p><span className="destacado">Teléfono:</span> {demandante.tel_movil}</p>
                                                    <p><span className="destacado">Situación laboral:</span> {demandante.situacion === 0 ? "En paro" : "Trabajando"}</p>
                                                    <div><button onClick={() => inscribirDemandante(demandante.id, oferta.id)}>Inscribir</button></div>
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