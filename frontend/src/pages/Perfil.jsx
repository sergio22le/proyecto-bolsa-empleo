import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para obtener el ID de la URL
import "./Perfil.css";
import Header from "../components/header";
import Footer from "../components/footer";

const Perfil = () => {
    const {id} = useParams(); // Capturamos el ID del usuario desde la URL
    const [usuario, setUsuario] = useState(null);
    const [tipoUsuario, setTipoUsuario] = useState(""); // Puede ser "demandante" o "empresa"

    useEffect(() => {
        // Hacer la petición al backend para obtener los datos del usuario
        fetch(`http://localhost:8000/api/usuarios/${id}`) // Reemplaza con la URL correcta de tu API
            .then(response => response.json())
            .then(data => {
                setUsuario(data);
                setTipoUsuario(data.tipo); 
            })
            .catch(error => console.error("Error al cargar los datos:", error));
    }, [id]);

    if (!usuario) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div className="perfil">
            <Header />
            <div className="body-perfil">
                <h1>Perfil personal de {usuario.nombre}</h1>
                <div className="container-perfil">
                    <form className="form-perfil">
                        <div className="datos-perfil">
                            <div className="nombre">
                                <label>Nombre</label>
                                <input type="text" value={usuario.nombre} readOnly />
                            </div>
                            <div className="ape-1">
                                <label>Primer apellido</label>
                                <input type="text" value={usuario.primer_apellido} readOnly />
                            </div>
                            {tipoUsuario === "demandante" && (
                                <div className="ape-2">
                                    <label>Segundo apellido</label>
                                    <input type="text" value={usuario.segundo_apellido} readOnly />
                                </div>
                            )}
                            <div className="dni">
                                <label>{tipoUsuario === "demandante" ? "DNI" : "CIF"}</label>
                                <input type="text" value={usuario.dni_cif} readOnly />
                            </div>
                            <div className="email">
                                <label>Email</label>
                                <input type="email" value={usuario.email} readOnly />
                            </div>
                            <div className="telefono">
                                <label>Teléfono</label>
                                <input type="text" value={usuario.telefono} readOnly />
                            </div>
                            {tipoUsuario === "empresa" && (
                                <div className="nombre-empresa">
                                    <label>Nombre de la empresa</label>
                                    <input type="text" value={usuario.nombre_empresa} readOnly />
                                </div>
                            )}
                        </div>
                        <button className="guardar" type="submit">Guardar cambios</button>
                    </form>
                </div>
                <a className="volver" href="/home">Volver</a>
            </div>
            <Footer />
        </div>
    );
}

export default Perfil;