import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest,stringToColor } from '../../utils/functions';
import ReactTableTanstack from '../../components/ReactTableTanstack';

const ListCompanies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSkillNames = (row) => {
        const raw = row?.FCTM_company_skills;
        if (!raw) return [];
        if (Array.isArray(raw)) {
            return raw
                .map(item => {
                    if (!item) return null;
                    if (typeof item === "string") return item;
                    if (typeof item === "object") {
                        return item.FCTM_skill_name || item.label || item.name || item.nombre || null;
                    }
                    return null;
                })
                .filter(Boolean);
        }
        if (typeof raw === "string") return [raw];
        if (typeof raw === "object") {
            const name = raw.FCTM_skill_name || raw.label || raw.name || raw.nombre;
            return name ? [name] : [];
        }
        return [];
    };

    // Columnas para la tabla
    const columnas = useMemo(() => [
        { key: 'SAO_username', encabezado: 'CIF' },
        { key: 'SAO_name', encabezado: 'Nombre' },
        { key: 'SAO_company_FCT_Number', encabezado: 'Nº Convenio FE' },
        { key: 'SAO_company_city', encabezado: 'Localidad' },
        /*{
            key: 'FCTM_company_category',
            encabezado: 'Familia',
            render: row => {
                // Si es array y tiene datos, mostrar todos los nombres separados por coma
                if (Array.isArray(row.FCTM_company_category) && row.FCTM_company_category.length > 0) {
                    return row.FCTM_company_category
                        .map(cat => cat.FCTM_category_name)
                        .filter(Boolean)
                        .join(', ');
                }
                // Si es objeto
                if (row.FCTM_company_category?.FCTM_category_name) {
                    return row.FCTM_company_category.FCTM_category_name;
                }
                // Si no hay familia
                return 'Sin familia';
            }
        },*/
        { key: "FCTM_company_skills",
              encabezado: "Skills / Tecnologías",
              // Esta función le dice a la tabla qué texto usar para BUSCAR y FILTRAR
              accessorFn: (row) => getSkillNames(row).join(" ") || "",
              
              // Esta función le dice a la tabla qué PINTAR en pantalla (tus chips)
              render: (row) => {
                const skills = getSkillNames(row);
                return (
                  <div className="d-flex flex-wrap gap-1">
                    {skills.length > 0 ? (
                      skills.map((skill) => {
                        const bgColor = stringToColor(skill);
                        
                        return (
                          <span 
                            key={skill} 
                            className="badge rounded-pill text-dark"
                            style={{ 
                              backgroundColor: bgColor,
                              border: '1px solid rgba(0,0,0,0.1)',
                              fontSize: '0.75rem'
                            }}
                          >
                            {skill}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-muted small">Sin skills</span>
                    )}
                  </div>
                );
              }
            },
        // Ver ficha desactivado
    ], []);

    // Fetch de empresas
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await sendRequest('GET', null, '/companies');
            if (res.success) setData(res.data);
            else setError(res.message || 'Error al cargar empresas');
        } catch (err) {
            setError(err.message || 'Error al cargar empresas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div>
            <h2>Empresas</h2>
            {loading && <p>Cargando empresas...</p>}
            {!loading && error && <p className="text-danger">{error}</p>}
            {!loading && !error && data.length === 0 && (
                <p className="text-muted">No hay empresas disponibles</p>
            )}
            {!loading && !error && data.length > 0 && (
                <ReactTableTanstack
                    tableTitle="Listado de Empresas"
                    datos={data}
                    columnas={columnas}
                    mobileMode="card"
                />
            )}
        </div>
    );
};

export default ListCompanies;


