import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'

import ShowHeader from '../../components/Show/ShowHeader'
import ShowReadonlyForm from '../../components/Show/ShowReadonlyForm'
import ShowEditableForm from '../../components/Show/ShowEditableForm'
import ListCRUD from '../../components/List/ListCRUD'

const columnasDocuments = [
  { key: '_id', encabezado: '#' },
  { key: 'FCTM_document_name', encabezado: 'Nombre' },
  { key: 'FCTM_document_url', encabezado: 'Ruta' },
  { key: 'FCTM_document_description', encabezado: 'Descripción' },
  { key: 'FCTM_document_type', encabezado: 'Tipo Doc.' },
]

const ShowJobOffer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null) // Datos del JobOffer cargado desde API
  const [loading, setLoading] = useState(true) // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false) // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null)

  // Cargar el JobOffer por ID
  const fetchJobOffer = useCallback(async () => {
    setLoading(true)

    const res = await sendRequest('GET', null, `/joboffers/${id}`)

    if (res.success) {
      setData(res.data)
      setOriginalData(res.data) // snapshot original
      console.log(res.data)
    } else {
      console.error('Error al cargar el joboffers:', res.message)
    }

    setLoading(false)
  }, [id])

  // Guardar cambios FCTM_
  const handleSave = async () => {
    const res = await sendRequest('PATCH', data, `/joboffers/${id}`)

    if (res.success) {
      setData(res.data)
      setOriginalData(res.data)
      setIsEditing(false)
    } else {
      showAlert(res.message, 'error')
    }
  }

  // Actualizar campos FCTM_ en estado local
  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCancel = () => {
    setData(originalData) // restauramos valores
    setIsEditing(false)
  }

  useEffect(() => {
    fetchJobOffer()
  }, [fetchJobOffer])

  if (loading) return <p>Cargando datos...</p>
  if (!data) return <p>No se encontraron datos</p>

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Ficha de ${data?.FCTM_job_title || 'JobOffer'}`}
        onBack={() => navigate('/joboffers')}
      />

      <ShowReadonlyForm data={data} />

      <ShowEditableForm
        data={data}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      <ListCRUD
        title="Datos JobOffer Relacionados"
        datos={data.FCTM_documents}
        columnas={columnasDocuments}
      >
        {/* Children */}
        <button
          className="btn btn-success"
          onClick={() => navigate('/documents/new')}
        >
          Añadir Documento
        </button>
      </ListCRUD>
    </section>
  )
}

export default ShowJobOffer
