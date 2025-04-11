// Este componente permite gestionar los títulos, ya sea para un demandante o para un administrador.

import { API_URL } from "../config";

import { useEffect, useState } from "react";
import Titulo from "./Titulo";

const Titulos = ({ usuario }) => {
    // Estado para almacenar los títulos asociados al demandante
    const [titulosUsuario, setTitulosUsuario] = useState([]);

    // Estado para almacenar todos los títulos disponibles (para el administrador)
    const [titulos, setTitulos] = useState([]);

    // Estado para controlar si se está mostrando la lista de títulos o el formulario para añadir uno nuevo
    const [estado, setEstado] = useState("comprobando");

    // Estado para almacenar los datos del nuevo título que se desea añadir
    const [nuevoTitulo, setNuevoTitulo] = useState({
        id_titulo: 1,
        centro: "",
        año: "",
        cursando: "No",
        nombre: "",
    });

    // Estado para controlar si los datos están cargando
    const [cargando, setCargando] = useState(true);

    // Token del usuario almacenado en sessionStorage
    const tokenUsuario = sessionStorage.getItem("token");

    // Tipo de usuario almacenado en sessionStorage (admin o demandante)
    const tipo = sessionStorage.getItem("tipo");

    // Función para obtener los títulos asociados al demandante desde el backend
    const getTitulosUsuario = async () => {
        try {
            const response = await fetch(`${API_URL}/demandantes/${usuario.id}/titulos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setTitulosUsuario(data.titulos); // Almacenar los títulos del demandante
            }
        } catch (e) {
            console.log(e.message); // Manejar errores en la solicitud
        }
    };

    // Función para obtener todos los títulos disponibles desde el backend
    const getTitulos = async () => {
        try {
            const response = await fetch(`${API_URL}/titulos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setTitulos(data.titulos); // Almacenar todos los títulos disponibles
            }
        } catch (e) {
            console.log(e.message); // Manejar errores en la solicitud
        }
    };

    // Función para añadir un nuevo título al backend
    const añadirTitulo = async (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        try {
            // Determinar el endpoint según el tipo de usuario
            const endpoint =
                tipo === "demandante"
                    ? `${API_URL}/demandantes/${usuario.id}/titulos`
                    : `${API_URL}/titulos`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
                body: JSON.stringify(nuevoTitulo), // Enviar los datos del nuevo título
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.titulo);
                cambiarEstado(); // Cambiar el estado para volver a la vista de títulos
            }
        } catch (e) {
            console.log(e.message); // Manejar errores en la solicitud
        }
    };

    // Función para alternar entre los estados "comprobando" y "creando"
    const cambiarEstado = () => {
        setEstado((prevEstado) => (prevEstado === "comprobando" ? "creando" : "comprobando"));
    };

    // Función para actualizar los datos del nuevo título mientras se escribe en el formulario
    const modificarDato = (e) => {
        const { name, value } = e.target;
        setNuevoTitulo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // useEffect para cargar los datos al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true); // Mostrar mensaje de carga
            await getTitulos(); // Obtener todos los títulos
            if (tipo === "demandante") {
                await getTitulosUsuario(); // Obtener los títulos del demandante si es demandante
            }
            setCargando(false); // Ocultar mensaje de carga
        };

        cargarDatos();
    }, [estado]); // Volver a cargar los datos si cambia el estado

    // Función para actualizar la lista de títulos después de eliminar uno
    const renderizar = () => {
        getTitulos();
    };

    return (
        <div className="titulos">
            {cargando ? (
                // Mostrar mensaje de carga mientras se obtienen los datos
                <p>Cargando los títulos...</p>
            ) : (
                <>
                    {estado === "comprobando" ? (
                        <>
                            <div className="cabecera">
                                {tipo === "demandante" ? (
                                    <>
                                        <h2>Mis títulos</h2>
                                        <div>
                                            <button onClick={cambiarEstado}>Añadir título</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2>Títulos registrados</h2>
                                        <div>
                                            <button onClick={cambiarEstado}>Añadir título</button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="container-titulos">
                                {(tipo === "demandante" && titulosUsuario.length > 0) ? (
                                    // Mostrar los títulos del demandante
                                    titulosUsuario.map((titulo) => (
                                        <Titulo key={titulo.id} titulo={titulo} usuario={usuario} />
                                    ))
                                ) : (tipo === "admin" && titulos.length > 0) ? (
                                    // Mostrar todos los títulos disponibles para el administrador
                                    titulos.map((titulo) => (
                                        <Titulo key={titulo.id} titulo={titulo} onEliminar={renderizar} />
                                    ))
                                ) : (
                                    <p className="info-titulos">No tienes títulos adjuntados.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Formulario para añadir un nuevo título */}
                            <form className="añadir-titulo" onSubmit={añadirTitulo}>
                                {tipo === "demandante" ? (
                                    <>
                                        <div>
                                            <label htmlFor="id_titulo">Título</label>
                                            <select
                                                className="id_titulo"
                                                name="id_titulo"
                                                onChange={modificarDato}
                                                required
                                            >
                                                {titulos.length > 0 ? (
                                                    titulos.map((titulo) => (
                                                        <option key={titulo.id} value={titulo.id}>
                                                            {titulo.nombre}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>No hay títulos disponibles</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="centro">Centro</label>
                                            <input
                                                type="text"
                                                name="centro"
                                                placeholder="Centro"
                                                onChange={modificarDato}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="año">Año</label>
                                            <input
                                                type="integer"
                                                name="año"
                                                placeholder="Año"
                                                onChange={modificarDato}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cursando">Cursando</label>
                                            <select
                                                className="cursando"
                                                name="cursando"
                                                onChange={modificarDato}
                                                required
                                            >
                                                <option value="Sí">Sí</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="submit">
                                            <button type="submit">Añadir título</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="nombre">Nombre</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                placeholder="Nombre"
                                                onChange={modificarDato}
                                                required
                                            />
                                        </div>
                                        <div className="submit">
                                            <button type="submit">Añadir título</button>
                                        </div>
                                    </>
                                )}
                            </form>
                            <div className="volver">
                                <a className="volver" onClick={cambiarEstado}>
                                    Volver
                                </a>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Titulos;
