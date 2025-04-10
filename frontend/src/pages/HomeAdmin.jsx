import { useState } from "react";
import Empresas from "../components/Empresas";
import Titulos from "../components/Titulos";

const HomeAdmin = () => {
    // Estado para controlar la función seleccionada (ver empresas o gestionar títulos)
    const [funcion, setFuncion] = useState("verEmpresas");

    // Objeto que mapea las funciones seleccionadas a los componentes correspondientes
    const estadoFuncion = {
        verEmpresas: <Empresas />, // Componente para ver empresas
        gestionarTitulos: <Titulos />, // Componente para gestionar títulos
    };

    return (
        <section className="section-funciones">
            {/* Opciones de funciones disponibles */}
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
                    <h4>Gestionar títulos</h4>
                </div>
            </div>
            {/* Renderizar el componente correspondiente a la función seleccionada */}
            <div className="funcion-actual">
                {estadoFuncion[funcion]}
            </div>
        </section>
    );
};

export default HomeAdmin;