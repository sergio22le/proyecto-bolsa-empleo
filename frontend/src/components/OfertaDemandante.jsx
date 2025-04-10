// Este componente representa una oferta individual disponible para un demandante y permite inscribirse o desinscribirse.

const OfertaDemandante = ({ oferta, accion, apuntada }) => {
  return (
    <div className="container-oferta">
      <div className="condiciones-oferta">
        {/* Mostrar la fecha de publicación de la oferta */}
        <div className="container-fecha-publi">
          <h4>Fecha publicación</h4>
          <p className="fecha-publi">{oferta.fecha_pub}</p>
        </div>
        {/* Mostrar el nombre de la oferta */}
        <div className="container-nombre-oferta">
          <h4>Oferta</h4>
          <p className="nombre-oferta">{oferta.nombre}</p>
        </div>
        {/* Mostrar el tipo de contrato */}
        <div className="container-tipo-cont">
          <h4>Tipo de contrato</h4>
          <p className="tipo-cont">{oferta.tipo_cont}</p>
        </div>
        {/* Mostrar el número de puestos disponibles */}
        <div className="container-num-puesto">
          <h4>Nº de puestos</h4>
          <p className="num-puesto">{oferta.num_puesto}</p>
        </div>
        {/* Botones para inscribirse o desinscribirse de la oferta */}
        <div className="botones">
          {apuntada ? (
            // Botón para desinscribirse si el usuario ya está inscrito
            <button
              className="desinscribirte"
              onClick={() => accion(oferta.id)}
            >
              Desinscribirte
            </button>
          ) : (
            // Botón para inscribirse si el usuario no está inscrito
            <button
              className="inscribirte"
              onClick={() => accion(oferta.id)}
            >
              Inscribirte
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfertaDemandante;