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
            }) 

            const data = await response.json();

            if (response.ok) {
                const ofertasEmpresa = data.ofertas.filter((oferta) => oferta.id_emp === usuario.id );
                setOfertas(ofertasEmpresa);
            }
        }
        catch (e) {
            console.log("Error al obtener las ofertas:", e.message);
        }
    }


    useEffect(()=>{
        obtenerOfertas();
    },[]);

    return (
        <div className="container-solicitudes">
            <h2>Solicitudes</h2>
            {ofertas.map((oferta) => (
                <Solicitud key={oferta.id} oferta={oferta} />
            ))}
        </div>
        
    )
}

export default Solicitudes;