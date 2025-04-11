// Este componente representa un título individual y muestra su información.
import { API_URL } from "../config";
import { useEffect, useState } from "react";

const Titulo = ({ titulo, onEliminar }) => {
    // Token del usuario almacenado en sessionStorage
    const tokenUsuario = sessionStorage.getItem("token");

    // Tipo de usuario almacenado en sessionStorage (admin o demandante)
    const tipo = sessionStorage.getItem("tipo");

    // Estado para almacenar el nombre del título
    const [nombreTitulo, setNombreTitulo] = useState("");

    // Función para obtener el nombre del título desde el backend
    const getNombreTitulo = async () => {
        if (tipo === "demandante") {
            // Si el usuario es un demandante
            try {
                const response = await fetch(`${API_URL}/titulos/${titulo.id_titulo}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenUsuario}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    return data.titulo.nombre; // Retornar el nombre del título
                }
            } catch (e) {
                console.log(e.message); // Manejar errores en la solicitud
                return null;
            }
        } else if (tipo === "admin") {
            // Si el usuario es un administrador
            try {
                const response = await fetch(`${API_URL}/titulos/${titulo.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenUsuario}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    return data.titulo.nombre; // Retornar el nombre del título
                }
            } catch (e) {
                console.log(e.message); // Manejar errores en la solicitud
                return null;
            }
        }
    };

    // Función para eliminar un título desde el backend
    const eliminarTitulo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/titulos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Título eliminado:", data.titulo);
                onEliminar(); // Llamar a la función de eliminación pasada como prop
            }
        } catch (e) {
            console.log(e.message); // Manejar errores en la solicitud
        }
    };

    // useEffect para obtener el nombre del título al montar el componente
    useEffect(() => {
        setNombreTitulo(getNombreTitulo());
    }, []);

    return (
        <>
            {tipo === "demandante" ? (
                // Vista para demandantes
                <div className="container-titulo">
                    <h2>{nombreTitulo}</h2>
                    <div className="datos-titulo">
                        <div>
                            <h4>Centro</h4>
                            <p>{titulo.centro}</p>
                        </div>
                        <div>
                            <h4>Año</h4>
                            <p>{titulo.año}</p>
                        </div>
                        <div>
                            <h4>Cursando</h4>
                            <p>{titulo.cursando}</p>
                        </div>
                    </div>
                </div>
            ) : (
                // Vista para administradores
                <div className="container-titulo">
                    <div className="datos-titulo">
                        <div>
                            <h4>Id</h4>
                            <p>{titulo.id}</p>
                        </div>
                        <div>
                            <h4>Nombre</h4>
                            <p>{titulo.nombre}</p>
                        </div>
                        <div>
                            {/* Botón para eliminar el título */}
                            <button
                                className="eliminar"
                                onClick={() => eliminarTitulo(titulo.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Titulo;