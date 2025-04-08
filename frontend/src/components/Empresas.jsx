import { useEffect, useState } from "react";
import Empresa from "./Empresa";

const Empresas = () => {

    const [error, setError] = useState("");
    const [empresasSinVerificar, setEmpresasSinVerificar] = useState(["vacio"]);

    const getEmpresas = async () => {
        const tokenUsuario = sessionStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8000/api/empresas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenUsuario,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                setError("Error al obtener las empresas");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const obtenerYFiltrarEmpresas = async () => {
            try {
                const data = await getEmpresas();
                console.log("Datos recibidos:", data);
        
                const empresasPorVerificar = data.empresas.filter((emp) => emp.validado === 0);
                console.log("Empresas por verificar:", empresasPorVerificar);
        
                if (empresasPorVerificar.length > 0) {
                    setEmpresasSinVerificar(empresasPorVerificar);
                } else {
                    setEmpresasSinVerificar([]);
                }
            } catch (error) {
                setError(error.message);
            }
        };
        
        obtenerYFiltrarEmpresas();
        
    }, []);

    const validar = async (id) => {
        const tokenUsuario = sessionStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8000/api/empresas/validate=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenUsuario,
                },
            });

            if (response.ok) {
                const empresasActualizadas = await getEmpresas();
                const empresasPorVerificar = empresasActualizadas.empresas.filter((emp) => emp.validado === 0);
                setEmpresasSinVerificar(empresasPorVerificar);
            } else {
                setError("Error al validar la empresa");
            }
        }
        catch (error) {
            setError(error.message);
        }

    }

    const rechazar = async (id) => {
        const tokenUsuario = sessionStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8000/api/empresas/reject=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenUsuario,
                },
            });

            if (response.ok) {
                const empresasActualizadas = await getEmpresas();
                const empresasPorVerificar = empresasActualizadas.empresas.filter((emp) => emp.validado === 0);
                setEmpresasSinVerificar(empresasPorVerificar);
            } else {
                setError("Error al rechazar la empresa");
            }
        }
        catch (error) {
            setError(error.message);
        }

    }

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {empresasSinVerificar[0] === "vacio" ? (
                <p className="info">Cargando empresas...</p>
            ) : (empresasSinVerificar.length > 0 ? (
                empresasSinVerificar.map((empresa) => (
                    <Empresa key={empresa.id} empresa={empresa} rechazar={rechazar} validar={validar}/>
            ))) : (
                <p className="info">No hay empresas sin verificar</p>
            )
            )}
        </div>
    );
};

export default Empresas;