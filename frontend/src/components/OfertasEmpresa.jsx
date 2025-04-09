import { useEffect, useState } from "react";
import OfertaEmpresa from "./OfertaEmpresa";

const OfertasEmpresa = () => {
  const [ofertas, setOfertas] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState("comprobando");
  const [titulos, setTitulos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const tokenUsuario = sessionStorage.getItem("token");

  const obtenerEmpresa = async () => {

    setCargando(true);

    try {
      const response = await fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmpresa(data.empresa);
      }
    } catch (e) {
      console.error("Error al obtener empresa:", e.message);
    }
  };

  const obtenerOfertas = async () => {

    setCargando(true);

    try {
      const response = await fetch("http://localhost:8000/api/ofertas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const ofertasFiltradas = data.ofertas.filter(
          (of) => of.id_emp === empresa.id
        );
        setOfertas(ofertasFiltradas);
      }
    } catch (e) {
      console.error("Error obteniendo las ofertas de la empresa:", e.message);
    }
  };

  const obtenerTitulos = async () => {

    setCargando(true);

    try {
      const response = await fetch("http://localhost:8000/api/titulos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTitulos(data.titulos);
      }
    } catch (e) {
      console.error("Error al obtener los títulos:", e.message);
    }
  };

  const cambiarEstado = () => {
    setEstado((prevEstado) =>
      prevEstado === "comprobando" ? "creando" : "comprobando"
    );
  };

  const crearOferta = async (e) => {

    e.preventDefault();
    
    setCargando(true);

    const nuevaOferta = {
      nombre: e.target.nombre.value,
      num_puesto: e.target.num_puesto.value,
      tipo_cont: e.target.tipo_cont.value,
      horario: e.target.horario.value,
      obs: e.target.obs.value,
      fecha_cierre: e.target.fecha_cierre.value,
      titulos: Array.from(e.target.titulos.selectedOptions).map(
        (option) => option.value
      ),
    };

    try {
      const response = await fetch("http://localhost:8000/api/ofertas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify(nuevaOferta),
      });

      if (response.ok) {
        setEstado("comprobando");
        obtenerOfertas();
      }
    } catch (e) {
      console.error("Error al crear oferta:", e.message);
    }
  };

  useEffect(() => {
    obtenerEmpresa();
    obtenerTitulos();
    setCargando(false);
  }, []);

  useEffect(() => {
    if (empresa) {
      obtenerOfertas();
      setCargando(false);
    }
  }, [empresa]);

  return (
    <div>
      {estado === "comprobando" ? (
        <div className="container-ofertas">
          <div className="cabecera-ofertas">
            <h2>Ofertas</h2>
            <button onClick={cambiarEstado}>Añadir oferta</button>
          </div>
          {ofertas.length > 0 ? (
            ofertas.map((oferta) => (
              <OfertaEmpresa key={oferta.id} oferta={oferta} />
            ))
          ) : (
            cargando ? (
              <div className="cargando">
                <p>Cargando ofertas...</p>
              </div>
            ) : (
              <div className="info">
                <p>No hay ofertas disponibles</p>
              </div>
            )
          )}
        </div>
      ) : (
        <>
        <form className="form-crear-oferta" onSubmit={crearOferta}>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" name="nombre" placeholder="Nombre" required />
          </div>
          <div>
            <label htmlFor="num_puesto">Número de puestos</label>
            <input
              type="number"
              name="num_puesto"
              placeholder="Número de puestos"
              required
            />
          </div>
          <div>
            <label htmlFor="tipo_cont">Tipo de contrato</label>
            <select className="tipo_cont" name="tipo_cont" required>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div>
            <label htmlFor="horario">Horario</label>
            <input type="text" name="horario" placeholder="Horario" required />
          </div>
          <div>
            <label htmlFor="obs">Observaciones</label>
            <input type="text" name="obs" placeholder="Observaciones" required />
          </div>
          <div>
            <label htmlFor="fecha_cierre">Fecha de cierre</label>
            <input
              type="date"
              name="fecha_cierre"
              placeholder="Fecha de cierre"
              required
            />
          </div>
          <div>
            <label htmlFor="titulos">Títulos</label>
            <select name="titulos" multiple required>
              {titulos.map((titulo) => (
                <option key={titulo.id} value={titulo.id}>
                  {titulo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="submit">
            <button type="submit" disabled={cargando}>
              Crear oferta
            </button>
          </div>
        </form>
        <div className="volver">
          <button onClick={cambiarEstado}>Volver</button>
        </div>
        </>
      )}
    </div>
  );
};

export default OfertasEmpresa;
