const Oferta = () => {
    return (
        <div className="container-oferta">
            <h2>Oferta</h2>
            <div className="oferta">
                <div className="condiciones-oferta">
                    <p className="fecha-publi">Fecha publi.</p>
                    <p className="empresa">Empresa</p>
                    <p className="contrato">Tipo contrato</p>
                    <p className="n-puestos">Numero de puestos</p>
                </div>
                <button><a href="/detalleOferta">Ver más</a></button>
            </div>
        </div>
    );
};

export default Oferta;