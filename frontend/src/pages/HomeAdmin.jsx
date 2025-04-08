import { useState } from "react";
import Titulos from "../components/Titulos";
import Empresas from "../components/Empresas";

const HomeAdmin = () => {
    
    const [funcion, setFuncion] = useState("verEmpresas");
    
    const estadoFuncion = {
        verEmpresas: <Empresas />,
        gestionarTitulos: <Titulos />
    };

    return (
        <section className="section-funciones">
            <div className="funciones">
                <div
                    className="ver-empresas"
                    onClick={() => setFuncion("verEmpresas")}
                >
                    <h4>Ver empresas</h4>
                </div>
                <div
                    className="gestionar-titulos"
                    onClick={() => setFuncion("gestionarTitulos")}
                >
                    <h4>Gestionar titulos</h4>
                </div>
            </div>
            <div className="funcion-actual">
                {estadoFuncion[funcion]}
            </div>
        </section>
    );

};

export default HomeAdmin;