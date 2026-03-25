import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { sendRequest, stringToColor } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import ListCRUD from '../../components/List/ListCRUD'


const ListStudents = () => {
  const [students, setStudents] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cargamos Alumnos
      const res = await sendRequest('GET', null, '/students');
      
      // 2. Cargamos Skills para mapear nombres si el backend no los popula
      const resSkills = await sendRequest('GET', null, '/skills/search?q=');
      if (resSkills.success) setAllSkills(resSkills.data);

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
      key: "FCTM_skills",
      encabezado: "Aptitudes/Skills",
      accessorFn: row => {
        if (!row.FCTM_skills) return "";
        return row.FCTM_skills.map(s => {
          if (typeof s === 'object') return s.FCTM_skill_name;
          const found = allSkills.find(sk => sk._id === s);
          return found ? found.FCTM_skill_name : "";
        }).filter(Boolean).join(" ");
      },
      render: (row) => {
        const skillList = (row.FCTM_skills || []).map(s => {
          if (typeof s === 'object') return s;
          return allSkills.find(sk => sk._id === s) || null;
        }).filter(Boolean);

        return (
          <div className="d-flex flex-wrap gap-1">
            {skillList.length > 0 ? (
              skillList.map((skill) => (
                <span
                  key={skill._id}
                  className="badge rounded-pill text-dark"
                  style={{
                    backgroundColor: stringToColor(skill.FCTM_skill_name || ""),
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
        );
      }
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
  ], [navigate, allSkills]);

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