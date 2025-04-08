import { useEffect, useState } from "react";
import OfertaDemandante from "./OfertaDemandante";

const OfertasDemandante = () => {
  const [ofertas, setOfertas] = useState([]);

  const tokenUsuario = sessionStorage.getItem("token");

  const obtenerOfertas = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ofertas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOfertas(data.ofertas.filter((oferta) => oferta.abierta === 1));
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    obtenerOfertas();
  }, []);

  return (
    <div className="container-ofertas">
      <h2>Ofertas Disponibles</h2>
      {ofertas.map((oferta) => (
        <OfertaDemandante key={oferta.id} oferta={oferta} />
      ))}
    </div>
  );
};

export default OfertasDemandante;