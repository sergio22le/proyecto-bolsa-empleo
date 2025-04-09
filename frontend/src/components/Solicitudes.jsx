import { useEffect, useState } from "react";
import Solicitud from "./Solicitud";

const Solicitudes = ({ usuario }) => {
    const tokenUsuario = sessionStorage.getItem("token");

    const [ofertas, setOfertas] = useState([]);

    const obtenerOfertas = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/ofertas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenUsuario}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const ofertasEmpresa = data.ofertas.filter(
                    (oferta) => oferta.id_emp === usuario.id && oferta.abierta === 1
                );
                setOfertas(ofertasEmpresa);
            }
        } catch (e) {
            console.log("Error al obtener las ofertas:", e.message);
        }
    };

    // Llama a obtenerOfertas al montar el componente
    useEffect(() => {
        obtenerOfertas();
    }, []);

    // Callback para actualizar las ofertas después de adjudicar
    const adjudicarOferta = () => {
        obtenerOfertas(); // Vuelve a cargar las ofertas
    };

    return (
        <div className="container-solicitudes">
            <h2>Solicitudes</h2>
            {ofertas.map((oferta) => (
                <Solicitud
                    key={oferta.id}
                    oferta={oferta}
                    onAdjudicar={adjudicarOferta} // Pasa el callback al componente hijo
                />
            ))}
        </div>
    );
};

export default Solicitudes;