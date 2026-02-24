import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'

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
      const normalizedData = normalizeJobOfferDates(res.data)
      setData(normalizedData)
      setOriginalData(normalizedData) // snapshot original
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

    </section>
  )
}

export default ShowJobOffer
