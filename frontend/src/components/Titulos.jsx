import { useEffect, useState } from "react";
import Titulo from "./Titulo";

const Titulos = ({ usuario }) => {
    const [titulosUsuario, setTitulosUsuario] = useState([]);
    const [titulos, setTitulos] = useState([]);
    const [estado, setEstado] = useState("comprobando");
    const [nuevoTitulo, setNuevoTitulo] = useState({
        id_titulo: "",
        centro: "",
        año: "",
        cursando: "",
        nombre: "",
    });
    const [cargando, setCargando] = useState(true);

    const tokenUsuario = sessionStorage.getItem("token");
    const tipo = sessionStorage.getItem("tipo");

    const getTitulosUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/demandantes/${usuario.id}/titulos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("GET TITULOS USUARIO -> Titulos del usuario: ", data.titulos);
                setTitulosUsuario(data.titulos);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const getTitulos = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/titulos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("GET TITULOS -> Titulos disponibles: ", data.titulos);
                setTitulos(data.titulos);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const añadirTitulo = async (e) => {
        e.preventDefault();

        try {
            const endpoint = tipo === "demandante"
                ? `http://localhost:8000/api/demandantes/${usuario.id}/titulos`
                : `http://localhost:8000/api/titulos`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
                body: JSON.stringify(nuevoTitulo),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.titulo);
                cambiarEstado();
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const cambiarEstado = () => {
        setEstado((prevEstado) => (prevEstado === "comprobando" ? "creando" : "comprobando"));
    };

    const modificarDato = (e) => {
        setNuevoTitulo({ ...nuevoTitulo, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            await getTitulos();
            if (tipo === "demandante") {
                await getTitulosUsuario();
            }
            setCargando(false);
        };

        cargarDatos();
    }, [estado]);

    return (
        <div className="titulos">
            {cargando ? (
                <p>Cargando los títulos...</p>
            ) : (
                <>
                    {estado === "comprobando" ? (
                        <>
                            <div className="cabecera">
                                {tipo === "demandante" ? (
                                    <>
                                        <h2>Mis títulos</h2>
                                        <div><button onClick={cambiarEstado}>Añadir título</button></div>
                                    </>
                                ) : (
                                    <>
                                        <h2>Títulos registrados</h2>
                                        <div><button onClick={cambiarEstado}>Añadir título</button></div>
                                    </>
                                )}
                            </div>
                            <div className="container-titulos">
                                {(tipo === "demandante" && titulosUsuario.length > 0) ? (
                                    titulosUsuario.map((titulo) => (
                                        <Titulo key={titulo.id} titulo={titulo} />
                                    ))
                                ) : (tipo === "admin" && titulos.length > 0) ? (
                                    titulos.map((titulo) => (
                                        <Titulo key={titulo.id} titulo={titulo} />
                                    ))
                                ) : (
                                    <p className="info-titulos">No tienes títulos adjuntados.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <form className="añadir-titulo" onSubmit={añadirTitulo}>
                                {tipo === "demandante" ? (
                                    <>
                                        <div>
                                            <label htmlFor="id_titulo">Título</label>
                                            <select className="id_titulo" name="id_titulo" required>
                                                {titulos.length > 0 ? (
                                                    titulos.map((titulo) => (
                                                        <option key={titulo.id} value={titulo.id}>{titulo.nombre}</option>
                                                    ))
                                                ) : (
                                                    <option disabled>No hay títulos disponibles</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="centro">Centro</label>
                                            <input type="text" name="centro" placeholder="Centro" onChange={modificarDato} required />
                                        </div>
                                        <div>
                                            <label htmlFor="año">Año</label>
                                            <input type="integer" name="año" placeholder="Año" onChange={modificarDato} required />
                                        </div>
                                        <div>
                                            <label htmlFor="cursando">Cursando</label>
                                            <select className="cursando" name="cursando" onChange={modificarDato} required>
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
                                            <input type="text" name="nombre" placeholder="Nombre" onChange={modificarDato} required />
                                        </div>
                                        <div className="submit">
                                            <button type="submit">Añadir título</button>
                                        </div>
                                    </>
                                )}
                            </form>
                            <div className="volver">
                                <a className="volver" onClick={cambiarEstado}>Volver</a>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Titulos;