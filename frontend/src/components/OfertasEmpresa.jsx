// Este componente muestra genera y maneja las ofertas de una empresa
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import OfertaEmpresa from "./OfertaEmpresa";

const OfertasEmpresa = () => {
  // Estado para almacenar las ofertas de la empresa
  const [ofertas, setOfertas] = useState([]);

  // Estado para almacenar los datos de la empresa
  const [empresa, setEmpresa] = useState(null);

  // Estado para controlar si se está mostrando la lista de ofertas o el formulario para crear una nueva
  const [estado, setEstado] = useState("comprobando");

  // Estado para almacenar los títulos disponibles
  const [titulos, setTitulos] = useState([]);

  // Estado para controlar si los datos están cargando
  const [cargando, setCargando] = useState(true);

  // Token del usuario almacenado en sessionStorage
  const tokenUsuario = sessionStorage.getItem("token");

  // Función para obtener los datos de la empresa desde el backend
  const obtenerEmpresa = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmpresa(data.empresa); // Almacenar los datos de la empresa
      }
    } catch (e) {
      console.error("Error al obtener empresa:", e.message);
    }
  };

  // Función para obtener las ofertas de la empresa desde el backend
  const obtenerOfertas = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/ofertas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Filtrar las ofertas que pertenecen a la empresa
        const ofertasFiltradas = data.ofertas.filter(
          (of) => of.id_emp === empresa.id
        );
        setOfertas(ofertasFiltradas); // Almacenar las ofertas en el estado
      }
    } catch (e) {
      console.error("Error obteniendo las ofertas de la empresa:", e.message);
    }
  };

  // Función para obtener los títulos disponibles desde el backend
  const obtenerTitulos = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/titulos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTitulos(data.titulos); // Almacenar los títulos en el estado
      }
    } catch (e) {
      console.error("Error al obtener los títulos:", e.message);
    }
  };

  // Función para alternar entre los estados "comprobando" y "creando"
  const cambiarEstado = () => {
    setEstado((prevEstado) =>
      prevEstado === "comprobando" ? "creando" : "comprobando"
    );
  };

  // Función para crear una nueva oferta
  const crearOferta = async (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    setCargando(true);

    // Preparar los datos de la nueva oferta
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
      const response = await fetch(`${API_URL}/ofertas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify(nuevaOferta), // Enviar los datos de la nueva oferta
      });

      if (response.ok) {
        setEstado("comprobando"); // Volver al estado de comprobación
        obtenerOfertas(); // Actualizar la lista de ofertas
      }
    } catch (e) {
      console.error("Error al crear oferta:", e.message);
    }
  };

  // useEffect para cargar los datos iniciales al montar el componente
  useEffect(() => {
    obtenerEmpresa();
    obtenerTitulos();
    setCargando(false);
  }, []);

  // useEffect para cargar las ofertas cuando se obtienen los datos de la empresa
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
            // Renderizar las ofertas de la empresa
            ofertas.map((oferta) => (
              <OfertaEmpresa key={oferta.id} oferta={oferta} />
            ))
          ) : cargando ? (
            <div className="cargando">
              <p>Cargando ofertas...</p>
            </div>
          ) : (
            <div className="info">
              <p>No hay ofertas disponibles</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Formulario para crear una nueva oferta */}
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