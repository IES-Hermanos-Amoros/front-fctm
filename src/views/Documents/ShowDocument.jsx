import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBackendHost, sendRequest, showAlert, formatDateDDMMYYYY } from '../../utils/functions'
import ShowHeader from '../../components/Show/ShowHeader'
import ShowEditableForm from '../../components/Show/ShowEditableForm'

const ShowDocument = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [documento, setDocumento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    FCTM_document_name: '',
    FCTM_document_description: '',
  })
  const [originalFormData, setOriginalFormData] = useState({
    FCTM_document_name: '',
    FCTM_document_description: '',
  })

  const editableFields = useMemo(
    () => [
      {
        key: 'FCTM_document_name',
        label: 'Nombre',
        type: 'text',
        required: true,
      },
      {
        key: 'FCTM_document_description',
        label: 'Descripcion',
        type: 'textarea',
      },
    ],
    []
  )

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true)
      setError(null)

      const res = await sendRequest('GET', null, `/documents/${id}`)

      if (res.success && res.data) {
        const doc = res.data
        const nextFormData = {
          FCTM_document_name: doc.FCTM_document_name || '',
          FCTM_document_description: doc.FCTM_document_description || '',
        }

        setDocumento(doc)
        setFormData(nextFormData)
        setOriginalFormData(nextFormData)
      } else {
        setError(res.message || 'No se pudo cargar el documento')
      }

      setLoading(false)
    }

    fetchDoc()
  }, [id])

  const handleEdit = () => {
    const nextFormData = {
      FCTM_document_name: documento?.FCTM_document_name || '',
      FCTM_document_description: documento?.FCTM_document_description || '',
    }

    setFormData(nextFormData)
    setOriginalFormData(nextFormData)
    setIsEditing(true)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const getRelationText = doc => {
    if (!doc) return 'Sin relacion'

    if (doc.FCTM_relacion_id) {
      if (typeof doc.FCTM_relacion_id === 'string') return doc.FCTM_relacion_id
      return (
        doc.FCTM_relacion_id.SAO_name ||
        doc.FCTM_relacion_id.FCTM_job_title ||
        doc.FCTM_relacion_id._id ||
        'Sin relacion'
      )
    }

    const related = []

    if (Array.isArray(doc.oferta_relacionada) && doc.oferta_relacionada.length) {
      doc.oferta_relacionada.forEach(item => {
        related.push(item?.FCTM_job_title || item?._id || 'Oferta')
      })
    }

    if (
      Array.isArray(doc.usuarios_relacionados) &&
      doc.usuarios_relacionados.length
    ) {
      doc.usuarios_relacionados.forEach(item => {
        related.push(item?.SAO_name || item?._id || 'Usuario')
      })
    }

    if (
      Array.isArray(doc.acciones_relacionadas) &&
      doc.acciones_relacionadas.length
    ) {
      doc.acciones_relacionadas.forEach(item => {
        related.push(item?.FCTM_action_title || item?.FCTM_action_type || item?._id || 'Accion')
      })
    }

    if (Array.isArray(doc.fct_relacionada) && doc.fct_relacionada.length) {
      doc.fct_relacionada.forEach(item => {
        related.push(item?._id || 'FCT')
      })
    }

    return related.length ? related.join(' | ') : 'Sin relacion'
  }

  const handleCancel = () => {
    setFormData(originalFormData)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const name = formData.FCTM_document_name?.trim()

    if (!name) {
      showAlert('El nombre del documento es obligatorio', 'error')
      return
    }

    const payload = {
      FCTM_document_name: name,
      FCTM_document_description: formData.FCTM_document_description?.trim() || '',
    }

    setSaving(true)
    const res = await sendRequest('PATCH', payload, `/documents/${id}`)
    setSaving(false)

    if (!res.success) return

    const updatedDocument = {
      ...documento,
      ...(res.data || {}),
      FCTM_document_name: payload.FCTM_document_name,
      FCTM_document_description: payload.FCTM_document_description,
    }

    setDocumento(updatedDocument)

    const nextFormData = {
      FCTM_document_name: updatedDocument.FCTM_document_name || '',
      FCTM_document_description: updatedDocument.FCTM_document_description || '',
    }

    setFormData(nextFormData)
    setOriginalFormData(nextFormData)
    setIsEditing(false)
  }

  if (loading) {
    return <div className="text-center my-5">Cargando...</div>
  }

  if (error || !documento) {
    return (
      <section className="dashboard section">
        <div className="alert alert-danger">
          {error || 'Documento no encontrado'}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </section>
    )
  }

  const hostFileUrl = documento.FCTM_document_url
    ? getBackendHost() + documento.FCTM_document_url
    : ''

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Ficha del documento: ${documento.FCTM_document_name || ''}`}
        onBack={() => navigate('/documents')}
      />

      <div className="row">
        <div className="col-lg-12">
          <div className="card p-4 shadow-sm rounded-3">
            <div className="mb-3">
              <label className="form-label fw-bold">ID</label>
              <input
                type="text"
                className="form-control"
                value={documento._id}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={documento.FCTM_document_name || ''}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Descripcion</label>
              <input
                type="text"
                className="form-control"
                value={documento.FCTM_document_description || ''}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Tipo</label>
              <input
                type="text"
                className="form-control"
                value={documento.FCTM_document_type || ''}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Subido por</label>
              <input
                type="text"
                className="form-control"
                value={documento.FCTM_document_created_by?.SAO_name || ''}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Fecha subida</label>
              <input
                type="text"
                className="form-control"
                value={
                  documento.FCTM_inserted_date
                    ? formatDateDDMMYYYY(documento.FCTM_inserted_date)
                    : ''
                }
                disabled
              />
            </div>
            <div className="mb-3">
              <a
                href={hostFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                Ver/Descargar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ShowEditableForm
          formTitle="Datos del Documento"
          formId="documentForm"
          data={formData}
          fields={editableFields}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card mt-4 shadow-sm rounded-3">
            <div className="card-header">
              <strong>Campos Protegidos</strong>
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label className="form-label fw-bold">FCTM_document_type</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={documento.FCTM_document_type || ''}
                  readOnly
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">FCTM_relacion_id</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={getRelationText(documento)}
                  readOnly
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">Nombre del archivo</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={documento.FCTM_document_name || ''}
                  readOnly
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">Ruta del archivo</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={documento.FCTM_document_url || ''}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label fw-bold">Acceso al archivo</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={hostFileUrl}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShowDocument
