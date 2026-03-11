import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'

import ShowHeader from '../../components/Show/ShowHeader'
import ShowReadonlyForm from '../../components/Show/ShowReadonlyForm'
import ShowEditableForm from '../../components/Show/ShowEditableForm'

import useEnumStore from '../../store/enumStore'

//CAMPOS DEL FORMULARIO
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
    options: [],
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
  const location = useLocation()
  const companyId = location.state?.companyId || null
  const returnPath = companyId ? `/companies/${companyId}` : '/joboffers'

  //ENUM STORE
  const cargarEnums = useEnumStore((state) => state.cargarEnums)
  const getEnumArray = useEnumStore((state) => state.getEnumArray)
  const enums = useEnumStore((state) => state.enums) 
  // Cargar enums
  useEffect(() => {
    cargarEnums()
  }, [])

  const jobStatusOptions = getEnumArray("JOB_STATUS")?.map(item => ({
    _id: item,
    nombre: item
  })) || []

  jobOfferFields.find(f => f.key === "FCTM_job_status").options = jobStatusOptions

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  const fetchJobOffer = useCallback(async () => {
    setLoading(true)

    const res = await sendRequest('GET', null, `/joboffers/${id}`)

    if (res.success) {
      const normalizedData = normalizeJobOfferDates(res.data)
      setData(normalizedData)
      setOriginalData(normalizedData)
    } else {
      console.error('Error al cargar el joboffers:', res.message)
    }

    setLoading(false)
  }, [id])

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

  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCancel = () => {
    setData(originalData)
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
        onBack={() => navigate(returnPath)}
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
