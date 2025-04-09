import { useEffect, useState } from "react";
import Perfil from "../components/Perfil.jsx";
import OfertasDemandante from "../components/OfertasDemandante.jsx";
import Titulos from "../components/Titulos.jsx";

const HomeDemandante = () => {
    const [funcion, setFuncion] = useState("verOfertas");
    const [usuario, setUsuario] = useState(null); // Inicializa como null en lugar de undefined
    const [idDemandante, setIdUsuario] = useState(null); // Inicializa como null

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
                setIdUsuario(data.usuario.id);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        obtenerUsuario();
    }, []);

    // Solo renderiza los componentes hijos si `usuario` tiene datos
    const estadoFuncion = usuario
        ? {
              verOfertas: <OfertasDemandante />,
              actualizarPerfil: <Perfil key={idDemandante} usuario={usuario} />,
              actualizarTitulos: <Titulos key={idDemandante} usuario={usuario} />,
          }
        : null;
          
    return (
        <section className="section-funciones">
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
                    <h4>Mis titulos</h4>
                </div>
            </div>
            <div className="funcion-actual">
                {estadoFuncion ? estadoFuncion[funcion] : <p>Cargando...</p>}
            </div>
        </section>
    );
};

export default HomeDemandante;