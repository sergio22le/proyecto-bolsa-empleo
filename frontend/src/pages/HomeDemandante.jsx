import { useEffect, useState } from "react";
import Perfil from "../components/Perfil.jsx"
import Titulos from "../components/Titulos.jsx";
import OfertasDemandante from "../components/OfertasDemandante.jsx";

const HomeDemandante = () => {
    const [funcion, setFuncion] = useState("verOfertas");
    const [usuario, setUsuario] = useState();
    const [idDemandante, setIdUsuario] = useState();
    
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
    },[])
    
    const estadoFuncion = {
        verOfertas: <OfertasDemandante />,
        actualizarPerfil: <Perfil key={idDemandante} usuario={usuario}/>,
        actualizarTitulos: <Titulos key={idDemandante} usuario={usuario}/>
    };

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
                    <h4>Perfil</h4>
                </div>
                <div
                    className="actualizarTitulos"
                    onClick={() => setFuncion("actualizarTitulos")}
                >
                    <h4>Mis titulos</h4>
                </div>
            </div>
            <div className="funcion-actual">
                {estadoFuncion[funcion]}
            </div>
        </section>
    );
};

export default HomeDemandante;