import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest,stringToColor } from '../../utils/functions';
import { useNavigate } from 'react-router-dom'
import ListCRUD from "../../components/List/ListCRUD";


const ListCompanies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

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
        { key: "FCTM_company_category",
              encabezado: "Familias Profesionales",
              // Esta función le dice a la tabla qué texto usar para BUSCAR y FILTRAR
              accessorFn: (row) => 
                row.FCTM_company_category?.map(cat => cat.FCTM_category_name).join(" ") || "",
              
              // Esta función le dice a la tabla qué PINTAR en pantalla (tus chips)
              render: (row) => (
                <div className="d-flex flex-wrap gap-1">
                  {row.FCTM_company_category?.length > 0 ? (
                    row.FCTM_company_category.map((cat) => {
                      // Generamos el color basado en el nombre de la categoría
                      const bgColor = stringToColor(cat.FCTM_category_name);
                      
                      return (
                        <span 
                          key={cat._id} 
                          className="badge rounded-pill text-dark" // Quitamos bg-info
                          style={{ 
                            backgroundColor: bgColor, // Color dinámico
                            border: '1px solid rgba(0,0,0,0.1)',
                            fontSize: '0.75rem'
                          }}
                        >
                          {cat.FCTM_category_name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-muted small">Sin categorías</span>
                  )}
                </div>
              )
            },
                {
                  key: "FCTM_skills",
                  encabezado: "¿Con qué trabajan?",
                  accessorFn: row => row.FCTM_skills?.map(skill => skill.FCTM_skill_name).join(" ") || "",
                  render: row => (
                    <div className="d-flex flex-wrap gap-1">
                      {row.FCTM_skills?.length > 0 ? (
                        row.FCTM_skills.map((skill) => {
                          const bgColor = stringToColor(skill.FCTM_skill_name);
                          return (
                            <span
                              key={skill._id}
                              className="badge rounded-pill text-dark"
                              style={{ backgroundColor: bgColor, border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                            >
                              {skill.FCTM_skill_name}
                            </span>
                          )
                        })
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </div>
                  )
                },
        // Columna de acción (ver ficha)
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
        <>            
            {loading && <p>Cargando empresas...</p>}
            {!loading && error && <p className="text-danger">{error}</p>}
            {!loading && !error && data.length === 0 && (
                <p className="text-muted">No hay empresas disponibles</p>
            )}
            {!loading && !error && data.length > 0 && (                
                <ListCRUD
                  title="Listado de Empresas"
                  datos={data}
                  columnas={columnas}
                  tableId="empresas"                          
                >                          
                </ListCRUD>
            )}
        </>
    );
};

export default ListCompanies;