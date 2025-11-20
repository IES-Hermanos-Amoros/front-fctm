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
            setCompanies(res.data || []);
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
                <ul>
                    {companies.map((company) => (
                        <li key={company.SAO_id || company.SAO_id}>
                            {company.SAO_id} - {company.SAO_name || company.SAO_name || "Empresa sin nombre"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListCompaniesSAO;