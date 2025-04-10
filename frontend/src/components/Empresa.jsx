// Este componente representa una empresa individual pendiente de verificación y permite validarla o rechazarla.

const Empresa = ({ empresa, validar, rechazar }) => {
    return (
        <div className="container-empresa">
            <div className="div-empresa">
                {/* Mostrar el CIF de la empresa */}
                <div className="cif-empresa">
                    <h4>CIF</h4>
                    <p className="fecha-registro">{empresa.cif}</p>
                </div>
                {/* Mostrar el nombre de la empresa */}
                <div className="nombre-empresa">
                    <h4>Empresa</h4>
                    <p className="empresa">{empresa.nombre}</p>
                </div>
                {/* Mostrar la localidad de la empresa */}
                <div className="localidad">
                    <h4>Localidad</h4>
                    <p className="localidad">{empresa.localidad}</p>
                </div>
            </div>
            <div className="div-boton">
                {/* Botón para validar la empresa */}
                <button className="boton-aceptar" onClick={() => validar(empresa.id)}>
                    Validar
                </button>
                {/* Botón para rechazar la empresa */}
                <button className="boton-rechazar" onClick={() => rechazar(empresa.id)}>
                    Rechazar
                </button>
            </div>
        </div>
    );
};

export default Empresa;