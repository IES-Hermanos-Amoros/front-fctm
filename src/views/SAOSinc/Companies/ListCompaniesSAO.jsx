import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { sendRequest, promptCredentials } from '../../../utils/functions';
import GenericTable from '../../../components/GenericTable'
import "./ListCompaniesSAO.css"


const host = import.meta.env.VITE_BASE_URL_BACKEND
// Conectamos el socket a tu backend
const socket = io(host);

const ListCompaniesSAO = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState("");

    useEffect(() => {
        // Escuchar progreso
        socket.on("progress-update", (data) => {
            setProgress(data.progress);
            setProgressMessage(data.message);
        });

        return () => socket.off("progress-update");
    }, []);

    const fetchCompanies = async () => {
        const credentials = await promptCredentials();
        if (!credentials) return; // Cancelado por usuario

        console.log(credentials)

        setLoading(true);
        setProgress(0);
        const res = await sendRequest("POST", credentials, "/api/v2/sao/companies_sinc");
        setLoading(false);

        if (res.success) {
            //console.log(res.data)
            const { newCompanies, updatedCompanies } = res.data;
            
            /*const companies = [
                ...newCompanies.map(c => ({
                    ...c,
                    status: 'Nueva',
                    SAO_MODIFIED_FIELDS: [],
                })),
                ...updatedCompanies.map(c => ({
                    ...c,
                    status: 'Actualizada',
                }))
            ];*/
            const companies = [
                ...newCompanies.map(c => ({ ...c, _id: c.SAO_id, status: 'Nueva', statusTooltip: '' })),
                ...updatedCompanies.map(c => ({
                    ...c,
                    _id: c.SAO_id, // clave única
                    status: 'Actualizada',
                    statusTooltip: c.SAO_MODIFIED_FIELDS.map(f => f.field).join(', ')
                }))
            ];

            setCompanies(companies); // suponiendo que tienes un useState
        } else {
            setCompanies([]);
            console.error("Error al cargar empresas:", res.message);
        }
    };

    // Definimos las columnas para GenericTable
    const columnas = [
        { key:"_id", encabezado: "#"} ,
        { key: "SAO_name", encabezado: "Nombre" },
        { key: "status", encabezado: "Tipo" },        
        { key: "SAO_company_city", encabezado: "Ciudad" },
        { key: "SAO_company_state", encabezado: "Provincia" },
        { key: "SAO_company_activity", encabezado: "Actividad" },
    ];

    // Función para renderizar el contenido del campo "Tipo" con tooltip
    /*const companiesWithTooltip = companies.map(c => ({
        ...c,
        status: c.statusTooltip ? (
            <span title={c.statusTooltip}>{c.status}</span>
        ) : c.status
    }));*/
    // Función para renderizar el contenido del campo "Tipo" con tooltip y estilo tipo label
    const companiesWithTooltip = companies.map(c => {
        const labelClass =
            c.status === "Nueva"
                ? "label-new"
                : c.status === "Actualizada"
                ? "label-updated"
                : "";

        return {
            ...c,
            status: (
                <span
                    title={c.statusTooltip || ""}
                    className={`status-label ${labelClass}`}
                >
                    {c.status}
                </span>
            )
        };
    });


    return (
         <section className='dashboard section'>
            <div className="row mb-3">
                <div className="col-12">
                    <button className="btn btn-success" onClick={fetchCompanies} disabled={loading}>
                        {loading ? "Cargando..." : "Cargar Empresas"}
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    {/* -------- PROGRESO CIRCULAR ---------- */}
                    {loading && (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <CircularProgress progress={progress} />
                            <p style={{ marginTop: "10px" }}>{progressMessage}</p>
                        </div>
                    )}

                    {/* ------- TABLA DE EMPRESAS -------- */}

                    {companies.length === 0 && !loading && <p>No hay empresas disponibles.</p>}

                    {companies.length > 0 && (
                        <GenericTable
                            key={companiesWithTooltip.length}
                            tableTitle="Empresas sincronizadas"
                            datos={companiesWithTooltip}
                            columnas={columnas}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};



// ---------------------------------------------------------
// 🎨 PROGRESO CIRCULAR TIPO APPLE
// ---------------------------------------------------------
const CircularProgress = ({ progress }) => {
    const radius = 60;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2}>
            <circle
                stroke="#ddd"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="#4CAF50"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
            <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                fontSize="20"
                fill="#444"
            >
                {Math.round(progress)}%
            </text>
        </svg>
    );
};

export default ListCompaniesSAO;