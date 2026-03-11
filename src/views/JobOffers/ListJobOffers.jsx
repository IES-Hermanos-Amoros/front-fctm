import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { sendRequest, confirmation, showAlert } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import ListCRUD from '../../components/List/ListCRUD'

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

      {
        key: 'FCTM_job_start_date',
        encabezado: 'Fec.Ini',
        render: row => formatDate(row.FCTM_job_start_date),
      },

      {
        key: 'FCTM_job_end_date',
        encabezado: 'Fec.Fin',
        render: row => formatDate(row.FCTM_job_end_date),
      },

{
      key: 'empresa',
      encabezado: 'Empresa',
      // accessorFn permite que el buscador global encuentre el texto
      accessorFn: row => row.empresa?.SAO_name || '',
      // Intentamos mostrar organización, si no existe, el nombre
      render: row => row.empresa?.SAO_name || '-',
    },

    {
      key: 'localidad',
      encabezado: 'Localidad',
      // Accedemos a la propiedad anidada para que sea indexable
      accessorFn: row => row.empresa?.SAO_company_city || '',
      render: row => row.empresa?.SAO_company_city || '-',
    },

      { key: 'FCTM_job_status', encabezado: 'Estado' },

      {
        key: '__show',
        encabezado: 'Ver',
        render: row => (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/jobOffers/${row._id}`)}
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
          >
            <i className="bi bi-trash"></i>
          </button>
        ),
      },
    ],
    [navigate]
  );

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
        <ListCRUD 
              title={'Gestión de Ofertas de Trabajo'}
              datos={data}
              columnas={columnas}       
        >
          {/* Botón de acción que ListCRUD recibe como children */}
          <button
            className="btn btn-success mb-3"
            onClick={() => navigate('/jobOffers/new')}
          >
            Nueva Oferta
          </button>

         
        </ListCRUD>
      )}
    </>
  )
}

export default ListJobOffers