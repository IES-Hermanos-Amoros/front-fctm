import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest,stringToColor } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import ReactTableTanstack from '../../components/ReactTableTanstack';

const skillOptions = [
    { _id: "69bd6bb2e1aa8f195c71c305", FCTM_skill_name: "ADAPTABILIDAD" },
    { _id: "69bd6bb2e1aa8f195c71c31d", FCTM_skill_name: "ADMINISTRACION DE SISTEMAS" },
    { _id: "69bd6bb2e1aa8f195c71c339", FCTM_skill_name: "ADOBE ILLUSTRATOR" },
    { _id: "69bd6bb2e1aa8f195c71c338", FCTM_skill_name: "ADOBE PHOTOSHOP" },
    { _id: "69bd6bb2e1aa8f195c71c341", FCTM_skill_name: "AGRICULTURA ECOLOGICA" },
    { _id: "69bd6bb2e1aa8f195c71c320", FCTM_skill_name: "ANGULAR" },
    { _id: "69bd6bb2e1aa8f195c71c32b", FCTM_skill_name: "ANALISIS DE DATOS" },
    { _id: "69bd6bb2e1aa8f195c71c32e", FCTM_skill_name: "ATENCION AL CLIENTE" },
    { _id: "69bd6bb2e1aa8f195c71c322", FCTM_skill_name: "AWS" },
    { _id: "69bd6bb2e1aa8f195c71c323", FCTM_skill_name: "AZURE" },
    { _id: "69bd6bb2e1aa8f195c71c344", FCTM_skill_name: "BOTANICA" },
    { _id: "69bd6bb2e1aa8f195c71c325", FCTM_skill_name: "C#" },
    { _id: "69bd6bb2e1aa8f195c71c326", FCTM_skill_name: "C++" },
    { _id: "69bd6bb2e1aa8f195c71c316", FCTM_skill_name: "CIBERSEGURIDAD" },
    { _id: "69bd6bb2e1aa8f195c71c315", FCTM_skill_name: "CLOUD COMPUTING" },
    { _id: "69bd6bb2e1aa8f195c71c301", FCTM_skill_name: "COMUNICACION EFECTIVA" },
    { _id: "69bd6bb2e1aa8f195c71c332", FCTM_skill_name: "CONTENT MARKETING" },
    { _id: "69bd6bb2e1aa8f195c71c345", FCTM_skill_name: "CONTROL DE PLAGAS" },
    { _id: "69bd6bb2e1aa8f195c71c308", FCTM_skill_name: "CREATIVIDAD" },
    { _id: "69bd6bb2e1aa8f195c71c310", FCTM_skill_name: "CSS3" },
    { _id: "69bd6bb2e1aa8f195c71c329", FCTM_skill_name: "DESARROLLO DE NEGOCIO" },
    { _id: "69bd6bb2e1aa8f195c71c30b", FCTM_skill_name: "DESARROLLO WEB" },
    { _id: "69bd6bb2e1aa8f195c71c335", FCTM_skill_name: "DISENO GRAFICO" },
    { _id: "69bd6bb2e1aa8f195c71c33b", FCTM_skill_name: "DOCENCIA" },
    { _id: "69bd6bb2e1aa8f195c71c318", FCTM_skill_name: "DOCKER" },
    { _id: "69bd6bb2e1aa8f195c71c334", FCTM_skill_name: "E-COMMERCE" },
    { _id: "69bd6bb2e1aa8f195c71c33c", FCTM_skill_name: "E-LEARNING" },
    { _id: "69bd6bb2e1aa8f195c71c33a", FCTM_skill_name: "EDICION DE VIDEO" },
    { _id: "69bd6bb2e1aa8f195c71c30a", FCTM_skill_name: "EMPATIA" },
    { _id: "69bd6bb2e1aa8f195c71c328", FCTM_skill_name: "ESTRATEGIA DE NEGOCIO" },
    { _id: "69bd6bb2e1aa8f195c71c337", FCTM_skill_name: "FIGMA" },
    { _id: "69bd6bb2e1aa8f195c71c343", FCTM_skill_name: "GESTION AMBIENTAL" },
    { _id: "69bd6bb2e1aa8f195c71c327", FCTM_skill_name: "GESTION DE PROYECTOS" },
    { _id: "69bd6bb2e1aa8f195c71c303", FCTM_skill_name: "GESTION DEL TIEMPO" },
    { _id: "69bd6bb2e1aa8f195c71c347", FCTM_skill_name: "GESTION FORESTAL" },
    { _id: "69bd6bb2e1aa8f195c71c317", FCTM_skill_name: "GIT" },
    { _id: "69bd6bb2e1aa8f195c71c333", FCTM_skill_name: "GOOGLE ANALYTICS" },
    { _id: "69bd6bb2e1aa8f195c71c309", FCTM_skill_name: "HABLAR EN PUBLICO" },
    { _id: "69bd6bb2e1aa8f195c71c30f", FCTM_skill_name: "HTML5" },
    { _id: "69bd6bb2e1aa8f195c71c33e", FCTM_skill_name: "INTEGRACION SOCIAL" },
    { _id: "69bd6bb2e1aa8f195c71c31a", FCTM_skill_name: "INTELIGENCIA ARTIFICIAL" },
    { _id: "69bd6bb2e1aa8f195c71c307", FCTM_skill_name: "INTELIGENCIA EMOCIONAL" },
    { _id: "69bd6bb2e1aa8f195c71c33d", FCTM_skill_name: "INTERVENCION SOCIAL" },
    { _id: "69bd6bb2e1aa8f195c71c348", FCTM_skill_name: "JARDINERIA" },
    { _id: "69bd6bb2e1aa8f195c71c30e", FCTM_skill_name: "JAVA" },
    { _id: "69bd6bb2e1aa8f195c71c30c", FCTM_skill_name: "JAVASCRIPT" },
    { _id: "69bd6bb2e1aa8f195c71c319", FCTM_skill_name: "KUBERNETES" },
    { _id: "69bd6bb2e1aa8f195c71c2ff", FCTM_skill_name: "LIDERAZGO" },
    { _id: "69bd6bb2e1aa8f195c71c31b", FCTM_skill_name: "MACHINE LEARNING" },
    { _id: "69bd6bb2e1aa8f195c71c32f", FCTM_skill_name: "MARKETING DIGITAL" },
    { _id: "69bd6bb2e1aa8f195c71c306", FCTM_skill_name: "NEGOCIACION" },
    { _id: "69bd6bb2e1aa8f195c71c312", FCTM_skill_name: "NODE.JS" },
    { _id: "69bd6bb2e1aa8f195c71c314", FCTM_skill_name: "NOSQL" },
    { _id: "69bd6bb2e1aa8f195c71c340", FCTM_skill_name: "ORIENTACION LABORAL" },
    { _id: "69bd6bb2e1aa8f195c71c342", FCTM_skill_name: "PAISAJISMO" },
    { _id: "69bd6bb2e1aa8f195c71c304", FCTM_skill_name: "PENSAMIENTO CRITICO" },
    { _id: "69bd6bb2e1aa8f195c71c324", FCTM_skill_name: "PHP" },
    { _id: "69bd6bb2e1aa8f195c71c32a", FCTM_skill_name: "PLANIFICACION ESTRATEGICA" },
    { _id: "69bd6bb2e1aa8f195c71c33f", FCTM_skill_name: "PSICOLOGIA" },
    { _id: "69bd6bb2e1aa8f195c71c30d", FCTM_skill_name: "PYTHON" },
    { _id: "69bd6bb2e1aa8f195c71c311", FCTM_skill_name: "REACT" },
    { _id: "69bd6bb2e1aa8f195c71c32c", FCTM_skill_name: "RECURSOS HUMANOS" },
    { _id: "69bd6bb2e1aa8f195c71c31e", FCTM_skill_name: "REDES DE COMPUTADORES" },
    { _id: "69bd6bb2e1aa8f195c71c302", FCTM_skill_name: "RESOLUCION DE PROBLEMAS" },
    { _id: "69bd6bb2e1aa8f195c71c331", FCTM_skill_name: "SEM" },
    { _id: "69bd6bb2e1aa8f195c71c330", FCTM_skill_name: "SEO" },
    { _id: "69bd6bb2e1aa8f195c71c31c", FCTM_skill_name: "SOPORTE TECNICO" },
    { _id: "69bd6bb2e1aa8f195c71c346", FCTM_skill_name: "SOSTENIBILIDAD" },
    { _id: "69bd6bb2e1aa8f195c71c313", FCTM_skill_name: "SQL" },
    { _id: "69bd6bb2e1aa8f195c71c300", FCTM_skill_name: "TRABAJO EN EQUIPO" },
    { _id: "69bd6bb2e1aa8f195c71c31f", FCTM_skill_name: "TYPESCRIPT" },
    { _id: "69bd6bb2e1aa8f195c71c336", FCTM_skill_name: "UI/UX" },
    { _id: "69bd6bb2e1aa8f195c71c32d", FCTM_skill_name: "VENTAS" },
    { _id: "69bd6bb2e1aa8f195c71c321", FCTM_skill_name: "VUE.JS" },
    { _id: "67fbdada0bad3c1287004a31", FCTM_skill_name: "AMABILIDAD DE COLOR BIEN" }
];

const ListCompanies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const skillMap = useMemo(
        () => Object.fromEntries(skillOptions.map((skill) => [skill._id, skill.FCTM_skill_name])),
        []
    );

    const getSkillNames = (row) => {
        const raw = row?.FCTM_skills ?? row?.FCTM_company_skills;
        if (!raw) return [];
        if (Array.isArray(raw)) {
            return raw
                .map(item => {
                    if (!item) return null;
                    if (typeof item === "string") {
                        return skillMap[item] || item;
                    }
                    if (typeof item === "object") {
                        return (
                            item.FCTM_skill_name ||
                            item.label ||
                            item.name ||
                            item.nombre ||
                            skillMap[item._id] ||
                            null
                        );
                    }
                    return null;
                })
                .filter(Boolean);
        }
        if (typeof raw === "string") return [skillMap[raw] || raw];
        if (typeof raw === "object") {
            const name = raw.FCTM_skill_name || raw.label || raw.name || raw.nombre || skillMap[raw._id];
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
        { key: "FCTM_skills",
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
        {
            key: "__show",
            encabezado: "Ver",
            render: (row) => (
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/companies/${row._id}`)}
                    title="Ver ficha"
                >
                    <i className="bi bi-search"></i>
                </button>
            )
        }
    ], [navigate]);

    // Fetch de empresas
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const companiesRes = await sendRequest('GET', null, '/companies');
            if (!companiesRes.success) {
                setError(companiesRes.message || 'Error al cargar empresas');
                return;
            }

            const companies = companiesRes.data || [];
            setData(companies);

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


