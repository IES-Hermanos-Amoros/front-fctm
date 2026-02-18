import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { sendRequest, confirmation, showAlert } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import ListCRUD from '../../components/List/ListCRUD'
import ReactTableTanstack from '../../components/ReactTableTanstack' // Asegúrate de que la ruta sea correcta

const ListJobOffers = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Formateador de fechas
  const formatDate = dateString => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // =======================
  // COLUMNAS MEMORIZADAS
  // =======================
  const columnas = useMemo(
    () => [
      { key: 'FCTM_job_title', encabezado: 'Título' },
      { key: 'FCTM_job_status', encabezado: 'Estado' },
      {
        key: 'FCTM_job_start_date',
        encabezado: 'Fecha Inicio',
        render: row => formatDate(row.FCTM_job_start_date),
      },
      {
        key: 'FCTM_job_end_date',
        encabezado: 'Fecha Cierre',
        render: row => formatDate(row.FCTM_job_end_date),
      },
      {
        key: '__show',
        encabezado: 'Ver',
        render: row => (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/jobOffers/${row._id}`)}
            title="Ver oferta"
          >
            <i className="bi bi-search"></i>
          </button>
        ),
      },
      {
        key: '__delete',
        encabezado: 'Eliminar',
        render: row => (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(row._id)}
            title="Eliminar oferta"
          >
            <i className="bi bi-trash"></i>
          </button>
        ),
      },
    ],
    [navigate]
  )

  const handleDelete = async id => {
    const confirmado = await confirmation('¿Seguro que quieres eliminar esta oferta?')
    if (!confirmado) return
    const res = await sendRequest('DELETE', undefined, `/jobOffers/${id}`)
    if (res.success) {
      showAlert('Oferta eliminada correctamente', 'success')
      fetchData()
    } else {
      showAlert(res.message, 'error')
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await sendRequest('GET', null, '/jobOffers')
      if (res.success) setData(res.data)
      else setError(res.message || 'Error al cargar las ofertas')
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // =======================
  // RENDER
  // =======================
  return (
    <>
      {loading && <p>Cargando ofertas...</p>}
      {!loading && error && <p className="text-danger">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-muted">No hay ofertas disponibles</p>
      )}

      {!loading && !error && data.length > 0 && (
        <ListCRUD title={'Gestión de Ofertas de Trabajo'}>
          {/* Botón de acción que ListCRUD recibe como children */}
          <button
            className="btn btn-success mb-3"
            onClick={() => navigate('/jobOffers/new')}
          >
            Nueva Oferta
          </button>

          {/* Inyectamos la tabla de Tanstack aquí abajo */}
          <ReactTableTanstack
            tableTitle="Lista de Ofertas"
            datos={data}
            columnas={columnas}
            mobileMode="card"
            mostrarCheckBox={false}
          />
        </ListCRUD>
      )}
    </>
  )
}

export default ListJobOffers