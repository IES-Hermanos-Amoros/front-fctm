import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendRequest, confirmation, showAlert } from '../../utils/functions'
import ListCRUD from "../../components/List/ListCRUD"

import ShowHeader from '../../components/Show/ShowHeader'
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
  const [documentData, setDocumentData] = useState([]) //Datos del Documents cargado desde API
  const [loading, setLoading] = useState(true) // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false) // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null)
  const [files, setFiles] = useState([])

  const columnasDocuments = [
    { key: 'FCTM_document_name', encabezado: 'Nombre'},
    { key: 'FCTM_document_type', encabezado: 'Tipo'},
    { 
      key: 'FCTM_document_url', 
      encabezado: 'Descarga',
      render: (row) => {
        if (!row) return "No disponible"

        const url = row.FCTM_document_url
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        )
      }
    },
    { key: 'FCTM_inserted_date', encabezado: 'Fecha '},
    { 
      key: '__delete', 
      encabezado: 'Eliminar',
      render: row => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDelete(row._id)}
          title="Eliminar Documento"
        >
          <i className="bi bi-trash"></i>
        </button>
      ),
    }
  ]

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
    if (res.data.FCTM_documents.length > 0) {
      const promises = res.data.FCTM_documents.map(async id =>
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

  const handleDelete = async id => {
  const confirmado = await confirmation('¿Seguro que quieres eliminar este documento?')
  if (!confirmado) return
    const res = await sendRequest('DELETE', undefined, `/documents/${id}`)
    if (res.success) {
      showAlert('Documento eliminado correctamente', 'success')
      fetchJobOffer()
    } else {
      showAlert(res.message, 'error')
    }
  }

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    if (selectedFiles.length > 10) {
      showAlert("Solo puedes subir un máximo de 10 documentos", "error")
      return
    }

    setFiles(selectedFiles)
  }

 const handleUploadDocs = async () => {
    if (files.length === 0) {
      showAlert("Debes seleccionar al menos un archivo", "error")
      return
    }

    if (files.length > 10) {
      showAlert("No puedes subir más de 10 archivos a la vez", "error")
      return
    }

    const formData = new FormData()

    files.forEach(file => {
      formData.append("documents", file)

      formData.append("FCTM_document_name", file.name)
      formData.append("FCTM_document_type", "GENERAL")
      formData.append("FCTM_document_url", file.name)
    })

    formData.append(
      "FCTM_document_created_by",
      "000000000000000000000000"
    )

    formData.append("jobOfferId", id)
    const res = await sendRequest("POST", formData, "/documents")
    console.log(res)

    if (res.success) {
      showAlert("Documentos subidos correctamente", "success")
      setFiles([])

       // ─── Extraer los IDs de los documentos recién creados ───
    const newDocumentIds = Array.isArray(res.data)
      ? res.data.map(doc => doc._id)
      : [res.data._id] // en caso de que solo devuelva un documento

    // ─── Unir con los documentos ya existentes en la oferta ───
    const updatedDocuments = [
      ...(data.FCTM_documents || []),
      ...newDocumentIds
    ]

    // ─── Hacer PATCH para actualizar la oferta con los nuevos documentos ───
    const patchRes = await sendRequest(
      "PATCH",
      { FCTM_documents: updatedDocuments },
      `/joboffers/${id}`
    )

    if (patchRes.success) {
      showAlert("Oferta actualizada con los documentos correctamente", "success")

      // Actualizamos estado local para reflejar los cambios
      setData(prev => ({
        ...prev,
        FCTM_documents: updatedDocuments
      }))
    } else {
      showAlert("Error actualizando la oferta: " + patchRes.message, "error")
    }

      fetchJobOffer()
    } else {
      showAlert(res.message, "error")
    }
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

      {isEditing && (
  <div className="card p-3 mt-3">

    <h5>Adjuntar Documentos</h5>

    <input
      type="file"
      multiple
      className="form-control"
      onChange={handleFileChange}
    />

    <button
      className="btn btn-primary mt-2"
      onClick={handleUploadDocs}
    >
      Adjuntar Docs.
    </button>

  </div>
)}

      {documentData.length === 0 ? (
        <h4>Oferta sin documentos</h4>
      ) : (
        <ListCRUD 
          title="Documentos Relacionados"
          datos={documentData}
          columnas={columnasDocuments}          
        />
      )}

    </section>
  )
}

export default ShowJobOffer
