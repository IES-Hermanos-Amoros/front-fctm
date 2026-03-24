import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { sendRequest } from '../../utils/functions'
import ReactTableTanstack from '../../components/List/ReactTableTanstack'

const ListFcts = () => {
  const [fcts, setFcts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columnas = useMemo(
    () => [
      { key: 'SAO_student_id', encabezado: 'NIA' },
      { key: 'SAO_student_fullname', encabezado: 'Alumno' },
      { key: 'SAO_company_name', encabezado: 'Empresa' },
      { key: 'SAO_company_city', encabezado: 'Localidad' },
      { key: 'SAO_company_center_name', encabezado: 'Centro de Trabajo' },
      { key: 'SAO_instructor_name', encabezado: 'Instructor Empresa' },
      { key: 'SAO_teacher_fullname', encabezado: 'Tutor Curso' },
      { key: 'FCTM_ies_instructor', encabezado: 'Tutor IES' },
      { key: 'SAO_dates', encabezado: 'Fechas' },
      { key: 'SAO_hours', encabezado: 'Horas' },
      { key: 'SAO_period', encabezado: 'Curso / Periodo' },
    ],
    []
  )

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await sendRequest('GET', null, '/fct')
      if (res.success) {
        setFcts(res.data)
      } else {
        setError(res.message || 'Error al cargar FCTs')
      }
    } catch (err) {
      setError(err.message || 'Error al cargar FCTs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <section className="dashboard section">
      {loading && <p>Cargando FCTs...</p>}

      {!loading && error && <p className="text-danger">{error}</p>}

      {!loading && !error && fcts.length === 0 && (
        <p className="text-muted">No hay FCTs disponibles</p>
      )}

      {!loading && !error && fcts.length > 0 && (
        <div className="row">
          <div className="col-12">
            <ReactTableTanstack
              tableTitle="Listado de FCTs"
              datos={fcts}
              columnas={columnas}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default ListFcts
