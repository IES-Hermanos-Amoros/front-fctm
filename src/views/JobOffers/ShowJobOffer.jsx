import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import ListCRUD from "../../components/List/ListCRUD"

import ShowHeader from '../../components/Show/ShowHeader'
import ShowReadonlyForm from '../../components/Show/ShowReadonlyForm'
import ShowEditableForm from '../../components/Show/ShowEditableForm'

const jobStatusTypes = [
  { _id: 'ACTIVA', nombre: 'ACTIVA' },
  { _id: 'CERRADA', nombre: 'CERRADA' },
  { _id: 'EN PROGRESO', nombre: 'EN PROGRESO' },
]

const jobOfferFields = [
  { key: 'FCTM_job_title', label: 'Título de la oferta', type: 'text', required: true },
  { key: 'FCTM_job_description', label: 'Descripción', type: 'textarea', required: true },
  { key: 'FCTM_job_requirements', label: 'Requisitos', type: 'textarea' },
  { key: 'FCTM_job_start_date', label: 'Fecha de inicio', type: 'date', required: true },
  { key: 'FCTM_job_end_date', label: 'Fecha de cierre', type: 'date' },
  { key: 'FCTM_job_salary', label: 'Salario', type: 'text' },
  {
    key: 'FCTM_job_status',
    label: 'Estado',
    type: 'select',
    options: jobStatusTypes,
    optionValue: '_id',
    optionLabel: 'nombre',
  },
  { key: 'FCTM_job_observations', label: 'Observaciones', type: 'textarea' },
]

const formatDateForInput = value => {
  if (!value) return ''

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    const isoDateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (isoDateMatch) return isoDateMatch[1]

    const parsedDate = new Date(value)
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10)
    }
  }

  return value
}

const normalizeJobOfferDates = jobOffer => {
  if (!jobOffer) return jobOffer

  return {
    ...jobOffer,
    FCTM_job_start_date: formatDateForInput(jobOffer.FCTM_job_start_date),
    FCTM_job_end_date: formatDateForInput(jobOffer.FCTM_job_end_date),
  }
}

const columnasDocuments = [
  { key: 'FCTM_document_name', encabezado: 'Nombre'},
  { key: 'FCTM_document_type', encabezado: 'Tipo'},
  { key: 'FCTM_document_url', encabezado: 'Descarga'},
  { key: 'FCTM_inserted_date', encabezado: 'Fecha '}
]

const ShowJobOffer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  //BORRAR DESPUES DE LA PRUEBA
  const FCTM_documents = ["6929cea2bb70b6ef13583ccd","6929cea2bb70b6ef13583ccc","698b5e1f64da230782b54378"]

  const [data, setData] = useState(null) // Datos del JobOffer cargado desde API
  const [documentData, setDocumentData] = useState([]) //Datos del Documents cargado desde API
  const [loading, setLoading] = useState(true) // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false) // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null)

  // Cargar el JobOffer por ID
  const fetchJobOffer = useCallback(async () => {
    setLoading(true)

    const res = await sendRequest('GET', null, `/joboffers/${id}`)

    if (res.success) {
      const normalizedData = normalizeJobOfferDates(res.data)
      setData(normalizedData)
      setOriginalData(normalizedData) // snapshot original
      console.log(res.data)
    } else {
      console.error('Error al cargar el joboffers:', res.message)
    }

    //Obtener documentos asociados
    if (FCTM_documents.length > 0) {
      const promises = FCTM_documents.map(async id =>
          await sendRequest('GET', null, `/documents/${id}`)
      )
      const responses = await Promise.all(promises)
      const documents = responses.filter(res => res.success).map(res => res.data)
      // Ordenar por fecha
      const sortedDocuments = [...documents].sort(
        (a, b) => new Date(b.FCTM_inserted_date) - new Date(a.FCTM_inserted_date)
      )
      setDocumentData(sortedDocuments)
    }

    setLoading(false)
  }, [id])

  // Guardar cambios FCTM_
  const handleSave = async () => {
    const res = await sendRequest('PATCH', data, `/joboffers/${id}`)

    if (res.success) {
      const normalizedData = normalizeJobOfferDates(res.data)
      setData(normalizedData)
      setOriginalData(normalizedData)
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

      <ShowEditableForm
        formTitle="Información de la Oferta de Trabajo"
        formId="ftcmForm"
        data={data}
        fields={jobOfferFields}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      <ListCRUD 
          title="Documentos Relacionados"
          datos={documentData}
          columnas={columnasDocuments}          
      />

    </section>
  )
}

export default ShowJobOffer
