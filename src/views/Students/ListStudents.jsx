import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { sendRequest, stringToColor } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import ListCRUD from '../../components/List/ListCRUD'


const ListStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendRequest('GET', null, '/students');
      if (res.success) setStudents(res.data);
      else setError(res.message || 'Error al cargar alumnos');
    } catch (err) {
      setError(err.message || 'Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const colStudents = useMemo(() => [
    { key: "SAO_username", encabezado: "NIA" },
    { key: "SAO_name", encabezado: "Nombre" },
    { key: "SAO_student_city", encabezado: "Localidad" },
    {
      key: "FCTM_student_skills",
      encabezado: "Aptitudes/Skills",
      accessorFn: row => row.FCTM_student_skills?.map(s => s.FCTM_skill_name).join(" ") || "",
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.FCTM_student_skills?.length > 0 ? (
            row.FCTM_student_skills.map((skill) => (
              <span
                key={skill._id}
                className="badge rounded-pill text-dark"
                style={{ 
                  backgroundColor: stringToColor(skill.FCTM_skill_name), 
                  border: '1px solid rgba(0,0,0,0.1)', 
                  fontSize: '0.7rem' 
                }}
              >
                {skill.FCTM_skill_name}
              </span>
            ))
          ) : (
            <span className="text-muted small">Sin aptitudes</span>
          )}
        </div>
      )
    },
    {
      key: "Actions", encabezado: "Acciones",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate(`/students/${row._id}`)}
          title="Ver ficha"
        >
          <i className="bi bi-search"></i>
        </button>
      )
    }
  ], [navigate]);

  return (
    <>            
      {loading && <p>Cargando alumnos...</p>}
      {!loading && error && <p className="text-danger">{error}</p>}
      {!loading && !error && students.length === 0 && (
          <p className="text-muted">No hay alumnos disponibles</p>
      )}
      {!loading && !error && students.length > 0 && (                
          <ListCRUD
            title="Listado de Alumnos"
            datos={students}
            columnas={colStudents}
            tableId="alumnos"                                     
          />                
      )}
    </>
  )
}

export default ListStudents