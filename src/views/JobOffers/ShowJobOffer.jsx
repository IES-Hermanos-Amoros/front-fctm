import { useState, useEffect, useCallback } from 'react'
import { sendRequest, confirmation, showAlert, formatDateDDMMYYYYHHmm, getBackendHost, normalizeFromApi, normalizeToApi } from '../../utils/functions'
import ListCRUD from "../../components/List/ListCRUD"
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import ShowHeader from '../../components/Show/ShowHeader'
import ShowEditableForm from '../../components/Show/ShowEditableForm'

import useEnumStore from '../../store/enumStore'

const SAO_FIELDS = [
  { key: "empresa_nombre", label: "Empresa", type: "text" },
  { key: "empresa_ciudad", label: "Ciudad / Ubicación", type: "text" }
];

const skillOptions = [
  { _id: "69bd6bb2e1aa8f195c71c305", FCTM_skill_name: "ADAPTABILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c31d", FCTM_skill_name: "ADMINISTRACIÓN DE SISTEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c339", FCTM_skill_name: "ADOBE ILLUSTRATOR" },
  { _id: "69bd6bb2e1aa8f195c71c338", FCTM_skill_name: "ADOBE PHOTOSHOP" },
  { _id: "69bd6bb2e1aa8f195c71c341", FCTM_skill_name: "AGRICULTURA ECOLÓGICA" },
  { _id: "69bd6bb2e1aa8f195c71c320", FCTM_skill_name: "ANGULAR" },
  { _id: "69bd6bb2e1aa8f195c71c32b", FCTM_skill_name: "ANÁLISIS DE DATOS" },
  { _id: "69bd6bb2e1aa8f195c71c32e", FCTM_skill_name: "ATENCIÓN AL CLIENTE" },
  { _id: "69bd6bb2e1aa8f195c71c322", FCTM_skill_name: "AWS" },
  { _id: "69bd6bb2e1aa8f195c71c323", FCTM_skill_name: "AZURE" },
  { _id: "69bd6bb2e1aa8f195c71c344", FCTM_skill_name: "BOTÁNICA" },
  { _id: "69bd6bb2e1aa8f195c71c325", FCTM_skill_name: "C#" },
  { _id: "69bd6bb2e1aa8f195c71c326", FCTM_skill_name: "C++" },
  { _id: "69bd6bb2e1aa8f195c71c316", FCTM_skill_name: "CIBERSEGURIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c315", FCTM_skill_name: "CLOUD COMPUTING" },
  { _id: "69bd6bb2e1aa8f195c71c301", FCTM_skill_name: "COMUNICACIÓN EFECTIVA" },
  { _id: "69bd6bb2e1aa8f195c71c332", FCTM_skill_name: "CONTENT MARKETING" },
  { _id: "69bd6bb2e1aa8f195c71c345", FCTM_skill_name: "CONTROL DE PLAGAS" },
  { _id: "69bd6bb2e1aa8f195c71c308", FCTM_skill_name: "CREATIVIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c310", FCTM_skill_name: "CSS3" },
  { _id: "69bd6bb2e1aa8f195c71c329", FCTM_skill_name: "DESARROLLO DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c30b", FCTM_skill_name: "DESARROLLO WEB" },
  { _id: "69bd6bb2e1aa8f195c71c335", FCTM_skill_name: "DISEÑO GRÁFICO" },
  { _id: "69bd6bb2e1aa8f195c71c33b", FCTM_skill_name: "DOCENCIA" },
  { _id: "69bd6bb2e1aa8f195c71c318", FCTM_skill_name: "DOCKER" },
  { _id: "69bd6bb2e1aa8f195c71c334", FCTM_skill_name: "E-COMMERCE" },
  { _id: "69bd6bb2e1aa8f195c71c33c", FCTM_skill_name: "E-LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c33a", FCTM_skill_name: "EDICIÓN DE VÍDEO" },
  { _id: "69bd6bb2e1aa8f195c71c30a", FCTM_skill_name: "EMPATÍA" },
  { _id: "69bd6bb2e1aa8f195c71c328", FCTM_skill_name: "ESTRATEGIA DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c337", FCTM_skill_name: "FIGMA" },
  { _id: "69bd6bb2e1aa8f195c71c343", FCTM_skill_name: "GESTIÓN AMBIENTAL" },
  { _id: "69bd6bb2e1aa8f195c71c327", FCTM_skill_name: "GESTIÓN DE PROYECTOS" },
  { _id: "69bd6bb2e1aa8f195c71c303", FCTM_skill_name: "GESTIÓN DEL TIEMPO" },
  { _id: "69bd6bb2e1aa8f195c71c347", FCTM_skill_name: "GESTIÓN FORESTAL" },
  { _id: "69bd6bb2e1aa8f195c71c317", FCTM_skill_name: "GIT" },
  { _id: "69bd6bb2e1aa8f195c71c333", FCTM_skill_name: "GOOGLE ANALYTICS" },
  { _id: "69bd6bb2e1aa8f195c71c309", FCTM_skill_name: "HABLAR EN PÚBLICO" },
  { _id: "69bd6bb2e1aa8f195c71c30f", FCTM_skill_name: "HTML5" },
  { _id: "69bd6bb2e1aa8f195c71c33e", FCTM_skill_name: "INTEGRACIÓN SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c31a", FCTM_skill_name: "INTELIGENCIA ARTIFICIAL" },
  { _id: "69bd6bb2e1aa8f195c71c307", FCTM_skill_name: "INTELIGENCIA EMOCIONAL" },
  { _id: "69bd6bb2e1aa8f195c71c33d", FCTM_skill_name: "INTERVENCIÓN SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c348", FCTM_skill_name: "JARDINERÍA" },
  { _id: "69bd6bb2e1aa8f195c71c30e", FCTM_skill_name: "JAVA" },
  { _id: "69bd6bb2e1aa8f195c71c30c", FCTM_skill_name: "JAVASCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c319", FCTM_skill_name: "KUBERNETES" },
  { _id: "69bd6bb2e1aa8f195c71c2ff", FCTM_skill_name: "LIDERAZGO" },
  { _id: "69bd6bb2e1aa8f195c71c31b", FCTM_skill_name: "MACHINE LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c32f", FCTM_skill_name: "MARKETING DIGITAL" },
  { _id: "69bd6bb2e1aa8f195c71c306", FCTM_skill_name: "NEGOCIACIÓN" },
  { _id: "69bd6bb2e1aa8f195c71c312", FCTM_skill_name: "NODE.JS" },
  { _id: "69bd6bb2e1aa8f195c71c314", FCTM_skill_name: "NOSQL" },
  { _id: "69bd6bb2e1aa8f195c71c340", FCTM_skill_name: "ORIENTACIÓN LABORAL" },
  { _id: "69bd6bb2e1aa8f195c71c342", FCTM_skill_name: "PAISAJISMO" },
  { _id: "69bd6bb2e1aa8f195c71c304", FCTM_skill_name: "PENSAMIENTO CRÍTICO" },
  { _id: "69bd6bb2e1aa8f195c71c324", FCTM_skill_name: "PHP" },
  { _id: "69bd6bb2e1aa8f195c71c32a", FCTM_skill_name: "PLANIFICACIÓN ESTRATÉGICA" },
  { _id: "69bd6bb2e1aa8f195c71c33f", FCTM_skill_name: "PSICOLOGÍA" },
  { _id: "69bd6bb2e1aa8f195c71c30d", FCTM_skill_name: "PYTHON" },
  { _id: "69bd6bb2e1aa8f195c71c311", FCTM_skill_name: "REACT" },
  { _id: "69bd6bb2e1aa8f195c71c32c", FCTM_skill_name: "RECURSOS HUMANOS" },
  { _id: "69bd6bb2e1aa8f195c71c31e", FCTM_skill_name: "REDES DE COMPUTADORES" },
  { _id: "69bd6bb2e1aa8f195c71c302", FCTM_skill_name: "RESOLUCIÓN DE PROBLEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c331", FCTM_skill_name: "SEM" },
  { _id: "69bd6bb2e1aa8f195c71c330", FCTM_skill_name: "SEO" },
  { _id: "69bd6bb2e1aa8f195c71c31c", FCTM_skill_name: "SOPORTE TÉCNICO" },
  { _id: "69bd6bb2e1aa8f195c71c346", FCTM_skill_name: "SOSTENIBILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c313", FCTM_skill_name: "SQL" },
  { _id: "69bd6bb2e1aa8f195c71c300", FCTM_skill_name: "TRABAJO EN EQUIPO" },
  { _id: "69bd6bb2e1aa8f195c71c31f", FCTM_skill_name: "TYPESCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c336", FCTM_skill_name: "UI/UX" },
  { _id: "69bd6bb2e1aa8f195c71c32d", FCTM_skill_name: "VENTAS" },
  { _id: "69bd6bb2e1aa8f195c71c321", FCTM_skill_name: "VUE.JS" }
];

// Normalización de SKILLS (Familias Profesionales)
const normalizationConfig = [
  {
    field: "FCTM_skills",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name",
    type: "multi"
  }
];

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

  // Campo de Familias Profesionales (SKILLS) con opciones estáticas
  {
    key: "FCTM_skills",
    label: "Aptitudes Demandadas",
    type: "select-multi",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
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
  const readOnly = location.state?.readOnly || false
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
    // Solo mostrar botón eliminar si readOnly es false
    ...(!readOnly ? [{
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
      )
    }] : [])
  ]

  const fetchJobOffer = useCallback(async () => {
    setLoading(true)

    const res = await sendRequest('GET', null, `/joboffers/${id}`)

    if (res.success) {
      let normalizedData = normalizeJobOfferDates(res.data)

      // 2. Aplanamos los datos de la empresa para que ShowEditableForm los lea
      if (res.data.empresa) {
        normalizedData = {
          ...normalizedData,
          empresa_nombre: res.data.empresa.SAO_name,
          empresa_ciudad: res.data.empresa.SAO_company_city
        }
      }

      // Normalizamos las SKILLS para que el select-multi las muestre correctamente
      normalizedData = normalizeFromApi(normalizedData, normalizationConfig)

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

    // Normalizar SKILLS antes de enviar 
    const payload = normalizeToApi(data, normalizationConfig)

    const res = await sendRequest('PATCH', payload, `/joboffers/${id}`)
    

    // Reconstruir objetos SKILLS después de guardar
    if (res.success) {
      let normalizedData = {
        ...res.data,
        FCTM_skills: res.data.FCTM_skills
          .map(id => skillOptions.find(opt => opt._id === id))
          .filter(Boolean)
      }


      // Normalizar SKILLS de nuevo para el estado después de reconstruirlos, para que el formulario los muestre correctamente
      normalizedData = normalizeFromApi(normalizedData, normalizationConfig)

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
              formTitle="Información de SAO"
              formId="jobOfferSaoForm"
              data={data}
              fields={SAO_FIELDS}
              hideEditButton={true}
            />

      <ShowEditableForm
        formTitle="Información de la Oferta de Trabajo"
        formId="ftcmForm"
        data={data}
        fields={jobOfferFields}
        isEditing={isEditing && !readOnly}   // si readOnly, nunca permitir editar
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
        hideEditButton={readOnly}  // Si readOnly es true, ocultamos el botón de editar
      />

      {isEditing && !readOnly && (
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
