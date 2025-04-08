import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetalleOferta = () => {
    const { id } = useParams();
    const [oferta, setOferta] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const tokenUsuario = sessionStorage.getItem("token");

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
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const getOferta = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/ofertas/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setOferta(data.oferta);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const inscribirse = async () => {

        try {
            const response = await fetch(`http://localhost:8000/api/ofertas/inscribir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
                body: JSON.stringify({ id_oferta: oferta.id, id_demandante: usuario.id }),
            });

            console.log("Datos enviados: ", { id_oferta: oferta.id, id_demandante: usuario.id });

            const data = await response.json();

            if (response.ok) {
                setOferta(data.oferta);
                navigate(`/home/${usuario.id}`);
            } else {
                console.error("Error al inscribirse:", data.message || "Respuesta inesperada del servidor.");
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        obtenerUsuario();
    }, []);

    useEffect(() => {
        if (usuario) {
            getOferta();
        }
    }, [id, usuario]);

    if (!oferta) {
        return <p>Cargando detalles de la oferta...</p>;
    }

    return (
        <section className="container-detalle-oferta">
            <div className="detalle-oferta">
                <h1>Detalle oferta</h1>
                <div className="datos-detalle-oferta">
                    <div className="datos-oferta">
                        <div className="nombre">
                            <h3>Oferta</h3>
                            <p>{oferta.nombre}</p>
                        </div>
                        <div className="contrato">
                            <h3>Tipo de contrato</h3>
                            <p>{oferta.tipo_cont}</p>
                        </div>
                        <div className="fecha-publi">
                            <h3>Fecha de publicación</h3>
                            <p>{oferta.fecha_pub}</p>
                        </div>
                        <div className="fecha-cierre">
                            <h3>Fecha de cierre</h3>
                            <p>{oferta.fecha_cierre}</p>
                        </div>
                        <div className="n-puestos">
                            <h3>Número de vacantes</h3>
                            <p>{oferta.num_puesto}</p>
                        </div>
                        <div className="horario">
                            <h3>Horario</h3>
                            <p>{oferta.horario}</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => inscribirse()}>Apuntarme</button>
                    </div>
                </div>
                <a className="volver" href={`/home/${usuario.id}`}>Volver</a>
            </div>
        </section>
    );
}

export default DetalleOferta;