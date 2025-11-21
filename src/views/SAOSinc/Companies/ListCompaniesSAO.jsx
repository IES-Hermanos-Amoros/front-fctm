import React, { useState } from 'react';
import { sendRequest, promptCredentials } from '../../../utils/functions';

const ListCompaniesSAO = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCompanies = async () => {
        const credentials = await promptCredentials();
        if (!credentials) return; // Cancelado por usuario

        console.log(credentials)

        setLoading(true);
        const res = await sendRequest("POST", credentials, "/api/v2/sao/companies_sinc");
        setLoading(false);

        if (res.success) {
            //console.log(res.data)
            const { newCompanies, updatedCompanies } = res.data;
        // Añadimos un flag a cada compañía
            const companies = [
                ...newCompanies.map(c => ({ ...c, status: 'new' })),
                ...updatedCompanies.map(c => ({ ...c, status: 'updated' }))
            ];

            setCompanies(companies); // suponiendo que tienes un useState
        } else {
            setCompanies([]);
            console.error("Error al cargar empresas:", res.message);
        }
    };

    return (
        <div>
            <h2>Listado de Empresas SAO</h2>
            <button onClick={fetchCompanies} disabled={loading}>
                {loading ? "Cargando..." : "Cargar Empresas"}
            </button>

            {companies.length === 0 && !loading && <p>No hay empresas disponibles.</p>}

            {companies.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Actividad</th>
                        <th>Ciudad</th>
                        <th>Estado</th>
                        <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                        <tr key={company.SAO_id} className={company.status}>
                            <td>{company.SAO_name}</td>
                            <td>{company.SAO_company_activity}</td>
                            <td>{company.SAO_company_city}</td>
                            <td>{company.SAO_company_state}</td>
                            <td>
                            {company.status === 'new' ? (
                                <span className="badge bg-success">Nueva</span>
                            ) : (
                                <span className="badge bg-warning">Actualizada</span>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListCompaniesSAO;