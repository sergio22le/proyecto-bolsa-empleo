import { useEffect, useState } from "react";
import Solicitudes from "../components/Solicitudes";
import Demandantes from "../components/Demandantes";
import OfertasEmpresa from "../components/OfertasEmpresa";

const HomeEmpresa = () => {
    const [funcion, setFuncion] = useState("crearOfertas");
    const [usuario, setUsuario] = useState({});
    const [cargando, setCargando] = useState(true); // Nuevo estado para controlar la carga

    const tokenUsuario = sessionStorage.getItem("token");

    const obtenerDatosUsuario = async () => {
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
                setUsuario(data.empresa);
                console.log("Obtenidos datos del usuario:", data.empresa);
            }
        } catch (e) {
            console.log("No se ha podido obtener los datos del usuario:", e.message);
        } finally {
            setCargando(false); // Finaliza la carga
        }
    };

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const estadoFuncion = {
        crearOfertas: <OfertasEmpresa key={usuario.id} usuario={usuario} />,
        consultarSolicitudes: <Solicitudes key={usuario.id} usuario={usuario} />,
        consultarDemandantes: <Demandantes key={usuario.id} usuario={usuario} />,
    };

    if (cargando) {
        return (
            <section className="section-funciones">
                    <h2 className="cargando">Cargando...</h2>
            </section>
        );
    }

    return (
        <section className="section-funciones">
            {usuario.validado === 1 ? (
                <>
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
                    <div className="funcion-actual">{estadoFuncion[funcion]}</div>
                </>
            ) : (
                <div className="pendiente-validacion">
                    <h2>Pendiente de validación por parte del administrador</h2>
                </div>
            )}
        </section>
    );
};

export default HomeEmpresa;