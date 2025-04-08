import { useEffect, useState } from "react";
import Solicitudes from "../components/Solicitudes";
import Demandantes from "../components/Demandantes";
import OfertasEmpresa from "../components/OfertasEmpresa";

const HomeEmpresa = () => {
    const [funcion, setFuncion] = useState("crearOfertas");
    const [usuario, setUsuario] = useState({});

    const tokenUsuario = sessionStorage.getItem("token");

    const obtenerDatosUsuario = async () => {

        try {
            const response = await fetch("http://localhost:8000/api/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            })

            const data = await response.json();

            if (response.ok) {
                setUsuario(data.empresa);
                console.log("Obtenidos datos del usuario:", data.empresa);
            }
        }
        catch (e) {
            console.log("No se ha podido obtener los datos del usuario:", e.message);
        }
    }

    useEffect(() => {
        obtenerDatosUsuario();
    }, [] )
    
    const estadoFuncion = {
        crearOfertas: <OfertasEmpresa key={usuario.id} usuario={usuario} />,
        consultarSolicitudes: <Solicitudes key={usuario.id} usuario={usuario} />,
        consultarDemandantes: <Demandantes key={usuario.id} usuario={usuario} />,
    };

    return (
        <section className="section-funciones">
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
            <div className="funcion-actual">
                {estadoFuncion[funcion]}
            </div>
        </section>
    );
};

export default HomeEmpresa;