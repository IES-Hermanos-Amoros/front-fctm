import { useState, useEffect, useCallback } from 'react'
import { sendRequest, confirmation, showAlert, formatDateDDMMYYYYHHmm, getBackendHost } from '../../utils/functions'
import ListCRUD from "../../components/List/ListCRUD"
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import ShowHeader from '../../components/Show/ShowHeader'
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

  const [data, setData] = useState(null) // Datos del JobOffer cargado desde API
  const [documentData, setDocumentData] = useState([]) //Datos del Documents cargado desde API
  const [loading, setLoading] = useState(true) // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false) // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null)
  const [files, setFiles] = useState([])
  
  const hostAPI = getBackendHost()

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
            <a href={hostAPI + url} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-download"></i> {/* Icono de descarga */}
            </a>
          )
        }
    },
    { key: 'FCTM_inserted_date', 
        encabezado: 'Fecha ',
        render: (row) => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)
    },
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

const handleDelete = async (docId) => {
  const confirmado = await confirmation('¿Seguro que quieres eliminar este documento?')
  if (!confirmado) return

  const res = await sendRequest('DELETE', undefined, `/documents/${docId}`)

  if (res.success) {
    const updatedDocuments = data.FCTM_documents.filter(item => item !== docId)
    const patchRes = await sendRequest(
      "PATCH",
      { FCTM_documents: updatedDocuments },
      `/joboffers/${id}` 
    )

    if (patchRes.success) {
      showAlert('Documento eliminado y oferta actualizada', 'success')

      setData(prev => ({
        ...prev,
        FCTM_documents: updatedDocuments
      }))

      fetchJobOffer()
    } else {
      showAlert('Error actualizando la oferta: ' + patchRes.message, 'error')
    }
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    if (selectedFiles.length > 10) {
      showAlert("Solo puedes subir un máximo de 10 documentos", "error")
      return
    }

    setFiles(selectedFiles)
  }

const handleUploadDocs__OLD = async () => {
  if (files.length === 0) {
    showAlert("Debes seleccionar al menos un archivo", "error")
    return
  }

  if (files.length > 10) {
    showAlert("No puedes subir más de 10 archivos a la vez", "error")
    return
  }

  let allNewIds = []
  if (files.length === 1) {
    const formData = new FormData()
    const file = files[0]
    formData.append("documents", file)
    formData.append("FCTM_document_name", file.name)
    formData.append("FCTM_document_type", "OTRO")
    formData.append("FCTM_document_url", file.name)
    formData.append("FCTM_document_created_by", "000000000000000000000000")
    formData.append("jobOfferId", id)

    const res = await sendRequest("POST", formData, "/documents")
    if (res.success) {
      allNewIds = Array.isArray(res.data) ? res.data.map(doc => doc._id) : [res.data._id]
    } else {
      showAlert(res.message, "error")
      return
    }
  } else {
    for (const file of files) {
      const formData = new FormData()
      
      formData.append("documents", file) 
      formData.append("FCTM_document_type", "OTRO") 
      formData.append("FCTM_document_name", file.name)
      formData.append("FCTM_document_url", file.name)
      formData.append("FCTM_document_created_by", "000000000000000000000000")
      formData.append("userId", "000000000000000000000000")
      formData.append("jobOfferId", id)

      const res = await sendRequest("POST", formData, "/documents")
      
      if (res.success) {
        const idCreated = Array.isArray(res.data) ? res.data[0]._id : res.data._id
        allNewIds.push(idCreated)
      }
    }
  }

  if (allNewIds.length > 0) {
    const updatedDocuments = [
      ...(data.FCTM_documents || []),
      ...allNewIds
    ]

    const patchRes = await sendRequest(
      "PATCH",
      { FCTM_documents: updatedDocuments },
      `/joboffers/${id}`
    )

    if (patchRes.success) {
      showAlert("Documentos subidos correctamente", "success")
      setData(prev => ({
        ...prev,
        FCTM_documents: updatedDocuments
      }))
      setFiles([])
    }
    fetchJobOffer()
  }
}


const handleUploadDocs = async () => {
  if (files.length === 0) {
    showAlert("Debes seleccionar al menos un archivo", "error")
    return
  }

  const formData = new FormData()
  
  // 1. Cambia 'documents' por 'files' para que coincida con el middleware: upload.array("files", 10)
  for (const file of files) {
    formData.append("files", file)
  }

  // 2. Agrega los datos adicionales al formData (Multer los recibirá en req.body)
  formData.append("FCTM_document_type", "GENERAL")
  formData.append("jobOfferId", id)
  // Nota: No envíes createdBy aquí si lo asignas en el backend desde req.user.id

  // 3. ¡IMPORTANTE! Llama a la ruta /documents/upload
  const res = await sendRequest("POST", formData, "/documents/upload")

  if (res.success) {
    showAlert("Documentos subidos correctamente", "success")
    
    // 4. Actualiza la oferta con los nuevos IDs
    const newDocIds = Array.isArray(res.data) ? res.data.map(d => d._id) : [res.data._id]
    const updatedDocuments = [...(data.FCTM_documents || []), ...newDocIds]
    
    const patchRes = await sendRequest("PATCH", { FCTM_documents: updatedDocuments }, `/joboffers/${id}`)
    
    if (patchRes.success) {
      setData(prev => ({ ...prev, FCTM_documents: updatedDocuments }))
      setFiles([])
      fetchJobOffer()
    }
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
