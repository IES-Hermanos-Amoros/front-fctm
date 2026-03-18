import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { sendRequest } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import ListCRUD from '../../components/List/ListCRUD'


const ListStudents = () => {

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

    // Fetch de alumnos
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

  const colStudents = [
    { key: "SAO_username", encabezado: "NIA" },
    { key: "SAO_name", encabezado: "Nombre" },
    { key: "SAO_student_city", encabezado: "Localidad" },
    {
      key:"Actions", encabezado:"Acciones",
      render: (row) => (
        <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => verFicha(row._id)}
        title="Ver ficha"
      >
        <i className="bi bi-search"></i>
      </button>
        
      )
    }
  ]
//  VER ESTUDIANTE POR ID 
  function verFicha(id) {
    navigate(`/students/${id}`)
  }

  return (
    <>            
            {loading && <p>Cargando alumnos...</p>}
            {!loading && error && <p className="text-danger">{error}</p>}
            {!loading && !error && students.length === 0 && (
                <p className="text-muted">No hay alumno disponibles</p>
            )}
            {!loading && !error && students.length > 0 && (                
                <ListCRUD
                  title="Listado de Alumnos"
                  datos={students}
                  columnas={colStudents}
                  tableId="alumnos"                          
                >                          
                </ListCRUD>
            )}
        </>
  )
}

export default ListStudents
