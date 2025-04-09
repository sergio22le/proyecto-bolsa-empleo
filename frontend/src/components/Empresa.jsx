const Empresa = ({ empresa, validar, rechazar }) => {
    return (
        <div className="container-empresa">
            <div className="div-empresa">
                <div className="cif-empresa">
                    <h4>CIF</h4>
                    <p className="fecha-registro">{empresa.cif}</p>
                </div>
                <div className="nombre-empresa">
                    <h4>Empresa</h4>
                    <p className="empresa">{empresa.nombre}</p>
                </div>
                <div className="localidad">
                    <h4>Empresa</h4>
                    <p className="localidad">{empresa.localidad}</p>
                </div>
            </div>
            <div className="div-boton">
                <button className="boton-aceptar" onClick={() => validar(empresa.id)}>Validar</button>
                <button className="boton-rechazar" onClick={() => rechazar(empresa.id)}>Rechazar</button>
            </div>
        </div>
    );
};

export default Empresa;