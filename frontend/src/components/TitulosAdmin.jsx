import { useEffect, useState } from "react";
import Titulo from "./Titulo";

const TitulosAdmin = () => {

    const tokenUsuario = sessionStorage.getItem("token");

    const [titulos, setTitulos] = useState([]);
    const [estado, setEstado] = useState("comprobando");
    const [nuevoTitulo, setNuevoTitulo] = useState({
        nombre: "",
    });
    const [cargando, setCargando] = useState(true);

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

        console.log("Añadiendo título:", nuevoTitulo);

        try {
            const response = await fetch(`http://localhost:8000/api/titulos`, {
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
        if (estado === "comprobando") {
            setEstado("añadiendo");
        }
        if (estado === "añadiendo") {
            setEstado("comprobando");
        }
    };

    const modificarDato = (e) => {
        setNuevoTitulo({ ...nuevoTitulo, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            await getTitulos();
            setCargando(false);
        };
        cargarDatos();
    }, []);

    return (
        <div className="titulos">
            {cargando ? (
                <p className="cargando">Cargando los títulos...</p>
            ) : (
                <div className="cabecera">
                    {estado === "comprobando" ? (
                        <>
                            <h2>Títulos registrados</h2>
                            <div><button onClick={cambiarEstado}>Añadir título</button></div>
                            
                            <div className="container-titulos">
                                {titulos.length > 0 ?
                                    titulos.map((titulo) => (
                                    <Titulo key={titulo.id} titulo={titulo} />
                                )) : (
                                    <p className="info">No tienes títulos adjuntados.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <form className="añadir-titulo" onSubmit={añadirTitulo}>
                                <div>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input type="text" name="nombre" placeholder="Nombre" onChange={modificarDato} required />
                                </div>
                                <div className="submit">
                                    <button type="submit">Añadir título</button>
                                </div>
                            </form>
                            <div className="volver">
                                <a className="volver" onClick={cambiarEstado}>Volver</a>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TitulosAdmin;