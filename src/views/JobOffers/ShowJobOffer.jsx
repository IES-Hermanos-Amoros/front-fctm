import { useState, useEffect, useCallback } from 'react'
import { sendRequest, confirmation, showAlert, formatDateDDMMYYYYHHmm, getBackendHost, normalizeFromApi, normalizeToApi, ensureSkills } from '../../utils/functions'
import ListCRUD from "../../components/List/ListCRUD"
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import ShowHeader from '../../components/Show/ShowHeader'
import ShowEditableForm from '../../components/Show/ShowEditableForm'

import useEnumStore from '../../store/enumStore'
import useSkillStore from '../../store/skillStore'

const SAO_FIELDS = [
  { key: 'empresa_nombre', label: 'Empresa', type: 'text' },
  { key: 'empresa_ciudad', label: 'Ciudad / Ubicación', type: 'text' },
]

const buildJobOfferFields = (jobStatusOptions, skillOptions) => [
  {
    key: 'FCTM_job_title',
    label: 'Título de la oferta',
    type: 'text',
    required: true,
  },
  {
    key: 'FCTM_job_description',
    label: 'Descripción',
    type: 'textarea',
    required: true,
  },
  { key: 'FCTM_job_requirements', label: 'Requisitos', type: 'textarea' },
  {
    key: 'FCTM_job_start_date',
    label: 'Fecha de inicio',
    type: 'date',
    required: true,
  },
  { key: 'FCTM_job_end_date', label: 'Fecha de cierre', type: 'date' },
  { key: 'FCTM_job_salary', label: 'Salario', type: 'text' },

  {
    key: 'FCTM_job_status',
    label: 'Estado',
    type: 'select',
    options: jobStatusOptions,
    optionValue: '_id',
    optionLabel: 'nombre',
  },
  // Campo de Aptitudes (SKILLS) con opciones dinámicas desde store
  {
    key: "FCTM_skills",
    label: "Aptitudes Demandadas",
    type: "select-multi-creatable", //NEW SKILLS
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  },

  { key: 'FCTM_job_observations', label: 'Observaciones', type: 'textarea' },
]

const normalizationConfig = [
  { field: "FCTM_job_start_date", type: "date" },
  { field: "FCTM_job_end_date", type: "date" }
];

const ShowJobOffer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const readOnly = location.state?.readOnly || false
  const companyId = location.state?.companyId || null
  const returnPath = companyId ? `/companies/${companyId}` : '/joboffers'

  //ENUM STORE
  const cargarEnums = useEnumStore(state => state.cargarEnums)
  const getEnumArray = useEnumStore(state => state.getEnumArray)
  const enums = useEnumStore(state => state.enums)
  const cargarSkills = useSkillStore(state => state.cargarSkills)
  const skillOptions = useSkillStore(state => state.skills)
  // Cargar enums y skills
  useEffect(() => {
    cargarEnums()
    cargarSkills()
  }, [cargarEnums, cargarSkills])

  const jobStatusOptions =
    getEnumArray('JOB_STATUS')?.map(item => ({
      _id: item,
      nombre: item,
    })) || []

  const jobOfferFields = buildJobOfferFields(jobStatusOptions, skillOptions)

  const [data, setData] = useState(null) // Datos del JobOffer cargado desde API
  const [documentData, setDocumentData] = useState([]) //Datos del Documents cargado desde API
  const [loading, setLoading] = useState(true) // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false) // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null)
  const [files, setFiles] = useState([])

  const hostAPI = getBackendHost()

  const columnasDocuments = [
    { key: 'FCTM_document_name', encabezado: 'Nombre' },
    { key: 'FCTM_document_type', encabezado: 'Tipo' },
    {
      key: 'FCTM_document_url',
      encabezado: 'Descarga',
      render: row => {
        if (!row || !row.FCTM_document_url) return 'No disponible'

        const url = row.FCTM_document_url
        return (
          <a href={hostAPI + url} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-download"></i> {/* Icono de descarga */}
          </a>
        )
      },
    },
    {
      key: 'FCTM_inserted_date',
      encabezado: 'Fecha ',
      render: row => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date),
    },
    // Solo mostrar botón eliminar si readOnly es false
    ...(!readOnly
      ? [
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
          },
        ]
      : []),
  ]

  const fetchJobOffer = useCallback(async () => {
      setLoading(true)

      const res = await sendRequest("GET", null, `/joboffers/${id}`)

      if (res.success) {

        let normalizedData = normalizeFromApi(
          res.data,
          normalizationConfig
        )

        // ✅ Aplanar empresa
        if (res.data.empresa) {
          normalizedData = {
            ...normalizedData,
            empresa_nombre: res.data.empresa.SAO_name,
            empresa_ciudad: res.data.empresa.SAO_company_city,
          }
        }

        // ✅ NO normalizamos skills aquí (las maneja ensureSkills)
        setData(normalizedData)
        setOriginalData(normalizedData)

    //Obtener documentos asociados
    if (res.data.FCTM_documents.length > 0) {
      const promises = res.data.FCTM_documents.map(
        async id => await sendRequest('GET', null, `/documents/${id}`)
      )
      const responses = await Promise.all(promises)
      const documents = responses
        .filter(res => res.success)
        .map(res => res.data)
      // Ordenar por fecha
      const sortedDocuments = [...documents].sort(
        (a, b) =>
          new Date(b.FCTM_inserted_date) - new Date(a.FCTM_inserted_date)
      )
      setDocumentData(sortedDocuments)
    }
        // ============================
        // ✅ CARGAR DOCUMENTS (NO BORRAR)
        // ============================

        if (res.data.FCTM_documents?.length > 0) {

          const promises = res.data.FCTM_documents.map(id =>
            sendRequest("GET", null, `/documents/${id}`)
          )

          const responses = await Promise.all(promises)

          const documents = responses
            .filter(r => r.success)
            .map(r => r.data)

          const sortedDocuments = [...documents].sort(
            (a, b) =>
              new Date(b.FCTM_inserted_date) -
              new Date(a.FCTM_inserted_date)
          )

          setDocumentData(sortedDocuments)

        } else {

          setDocumentData([])

        }

      } else {

        console.error(
          "Error al cargar joboffer:",
          res.message
        )

      }

      setLoading(false)

    }, [id])

  const handleDelete = async docId => {
    const confirmado = await confirmation(
      '¿Seguro que quieres eliminar este documento?'
    )
    if (!confirmado) return

    const res = await sendRequest('DELETE', undefined, `/documents/${docId}`)

    if (res.success) {
      const updatedDocuments = data.FCTM_documents.filter(
        item => item !== docId
      )
      const patchRes = await sendRequest(
        'PATCH',
        { FCTM_documents: updatedDocuments },
        `/joboffers/${id}`
      )

      if (patchRes.success) {
        showAlert('Documento eliminado y oferta actualizada', 'success')

        setData(prev => ({
          ...prev,
          FCTM_documents: updatedDocuments,
        }))

        fetchJobOffer()
      } else {
        showAlert('Error actualizando la oferta: ' + patchRes.message, 'error')
      }
    } else {
      showAlert(res.message, 'error')
    }
  }
  
//CAMBIO PARA LA PRECARGA DE LAS FECHAS
 const handleSave = async () => {
    try {
      // 1. PROCESAMIENTO DE SKILLS
      // Se asegura de que cualquier aptitud nueva creada manualmente en el select-multi 
      // se guarde en la base de datos y nos devuelva solo los IDs finales.
      const skillIds = await ensureSkills(data.FCTM_skills);

      // 2. CONSTRUCCIÓN MANUAL DEL PAYLOAD (CAMBIO CLAVE PARA EL ERROR 500)
      // Se ha dejado de usar 'normalizeToApi(data)' porque enviaba campos de 'empresa' 
      // (empresa_nombre, empresa_ciudad) que no pertenecen al modelo de JobOffer, 
      // lo que provocaba errores de validación en el backend.
      const finalPayload = {
        FCTM_job_title: data.FCTM_job_title,
        FCTM_job_description: data.FCTM_job_description,
        FCTM_job_requirements: data.FCTM_job_requirements || "",
        FCTM_job_salary: data.FCTM_job_salary || "",
        FCTM_job_status: data.FCTM_job_status,
        FCTM_job_observations: data.FCTM_job_observations || "",
        FCTM_skills: skillIds,
        
        // 3. ARREGLO DE FECHAS
        // Forzamos la captura directa del valor del estado. Al ser inputs de tipo 'date',
        // el valor ya viene en formato DD-MM-YYYY, que es lo que el backend espera.
        // Esto soluciona el fallo de que las fechas no se actualizaban correctamente.
        FCTM_job_start_date: data.FCTM_job_start_date, 
        FCTM_job_end_date: data.FCTM_job_end_date || null
      };

      // Log para verificar en consola que el objeto es "limpio" y solo contiene campos FCTM
      console.log("PAYLOAD REAL QUE SALE:", finalPayload);

      const res = await sendRequest("PATCH", finalPayload, `/joboffers/${id}`);

      if (res.success) {
        // 4. SINCRONIZACIÓN Y REFRESCO DE INTERFAZ
        // Tras el éxito, usamos un pequeño retraso para asegurar que la DB ha asentado los cambios.
        // Inmediatamente llamamos a fetchJobOffer() para volver a pedir los datos al servidor.
        // Esto garantiza que la "Fecha de Inicio" y "Cierre" se vean correctamente precargadas 
        // nada más terminar la edición
        setTimeout(() => {
          fetchJobOffer();
          setIsEditing(false);
          showAlert("Cambios guardados con éxito", "success");
        }, 500);
      } else {
        showAlert(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error guardando", "error");
    }
  };

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

  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files)

    if (selectedFiles.length > 10) {
      showAlert('Solo puedes subir un máximo de 10 documentos', 'error')
      return
    }

    setFiles(selectedFiles)
  }

  const handleUploadDocs = async () => {
    if (files.length === 0) {
      showAlert('Debes seleccionar al menos un archivo', 'error')
      return
    }

    const formData = new FormData()

    // 1. Cambia 'documents' por 'files' para que coincida con el middleware: upload.array("files", 10)
    for (const file of files) {
      formData.append('files', file)
    }

    // 2. Agrega los datos adicionales al formData (Multer los recibirá en req.body)
    formData.append('FCTM_document_type', 'GENERAL')
    formData.append('jobOfferId', id)
    // Nota: No envíes createdBy aquí si lo asignas en el backend desde req.user.id

    // 3. ¡IMPORTANTE! Llama a la ruta /documents/upload
    const res = await sendRequest('POST', formData, '/documents/upload')

    if (res.success) {
      showAlert('Documentos subidos correctamente', 'success')

      // 4. Actualiza la oferta con los nuevos IDs
      const newDocIds = Array.isArray(res.data)
        ? res.data.map(d => d._id)
        : [res.data._id]
      const updatedDocuments = [...(data.FCTM_documents || []), ...newDocIds]

      const patchRes = await sendRequest(
        'PATCH',
        { FCTM_documents: updatedDocuments },
        `/joboffers/${id}`
      )

      if (patchRes.success) {
        setData(prev => ({ ...prev, FCTM_documents: updatedDocuments }))
        setFiles([])
        fetchJobOffer()
      }
    } else {
      showAlert(res.message, 'error')
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
        isEditing={isEditing && !readOnly} // si readOnly, nunca permitir editar
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
        hideEditButton={readOnly} // Si readOnly es true, ocultamos el botón de editar
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

          <button className="btn btn-primary mt-2" onClick={handleUploadDocs}>
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