// Este componente muestra las empresas pendientes de verificación y permite validarlas o rechazarlas.

import { API_URL } from "../config";

import { useEffect, useState } from "react";
import Empresa from "./Empresa";

const Empresas = () => {
    // Estado para manejar errores
    const [error, setError] = useState("");

    // Estado para almacenar las empresas pendientes de verificación
    const [empresasSinVerificar, setEmpresasSinVerificar] = useState(["vacio"]);

    // Función para obtener todas las empresas desde el backend
    const getEmpresas = async () => {
        const tokenUsuario = sessionStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/empresas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenUsuario,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return data; // Retornar los datos obtenidos
            } else {
                setError("Error al obtener las empresas");
            }
        } catch (error) {
            setError(error.message); // Manejar errores en la solicitud
        }
    };

    // useEffect para cargar las empresas al montar el componente
    useEffect(() => {
        const obtenerYFiltrarEmpresas = async () => {
            try {
                const data = await getEmpresas();

                // Filtrar las empresas que no han sido validadas
                const empresasPorVerificar = data.empresas.filter((emp) => emp.validado === 0);

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

    // Función para validar una empresa
    const validar = async (id) => {
        const tokenUsuario = sessionStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/empresas/validate=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenUsuario,
                },
            });

            if (response.ok) {
                // Actualizar la lista de empresas pendientes de verificación
                const empresasActualizadas = await getEmpresas();
                const empresasPorVerificar = empresasActualizadas.empresas.filter((emp) => emp.validado === 0);
                setEmpresasSinVerificar(empresasPorVerificar);
            } else {
                setError("Error al validar la empresa");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Función para rechazar una empresa
    const rechazar = async (id) => {
        const tokenUsuario = sessionStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/empresas/reject=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenUsuario,
                },
            });

            if (response.ok) {
                // Actualizar la lista de empresas pendientes de verificación
                const empresasActualizadas = await getEmpresas();
                const empresasPorVerificar = empresasActualizadas.empresas.filter((emp) => emp.validado === 0);
                setEmpresasSinVerificar(empresasPorVerificar);
            } else {
                setError("Error al rechazar la empresa");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            {/* Mostrar mensaje de error si existe */}
            {error && <p className="error">{error}</p>}

            {/* Mostrar mensaje de carga mientras se obtienen las empresas */}
            {empresasSinVerificar[0] === "vacio" ? (
                <p className="info">Cargando empresas...</p>
            ) : (
                empresasSinVerificar.length > 0 ? (
                    // Renderizar las empresas pendientes de verificación
                    empresasSinVerificar.map((empresa) => (
                        <Empresa
                            key={empresa.id}
                            empresa={empresa}
                            rechazar={rechazar}
                            validar={validar}
                        />
                    ))
                ) : (
                    // Mostrar mensaje si no hay empresas pendientes de verificación
                    <p className="info">No hay empresas sin verificar</p>
                )
            )}
        </div>
    );
};

export default Empresas;