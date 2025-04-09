import { useEffect, useState } from "react";

const Titulo = ({ titulo, onEliminar }) => {

    const tokenUsuario = sessionStorage.getItem("token");
    const tipo = sessionStorage.getItem("tipo");

    const [nombreTitulo, setNombreTitulo] = useState("");

    const getNombreTitulo = async () => {

        if (tipo === "demandante") {
            try {
                const response = await fetch(`http://localhost:8000/api/titulos/${titulo.id_titulo}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenUsuario}`,
                    },
                })
    
                const data = await response.json();
    
                if (response.ok) {
                    return data.titulo.nombre;
                }
            }
            catch(e) {
                console.log(e.message);
                return null;
            }
        }
        else if (tipo === "admin") {
            try {
                const response = await fetch(`http://localhost:8000/api/titulos/${titulo.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenUsuario}`,
                    },
                })
    
                const data = await response.json();
    
                if (response.ok) {
                    return data.titulo.nombre;
                }
            }
            catch(e) {
                console.log(e.message);
                return null;
            }
        }
        
    }

    const eliminarTitulo = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/titulos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            })

            const data = await response.json();

            if (response.ok) {
                console.log("Titulo, borrado:", data.titulo);
                onEliminar();
            }
        }
        catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        setNombreTitulo(getNombreTitulo());
    },[])

    return (
        <>
            {tipo === "demandante" ? (
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
}

export default Titulo;