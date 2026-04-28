import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sendRequest, getBackendHost } from '../../utils/functions'

const ShowDocument = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [documento, setDocumento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true)
      setError(null)
      const res = await sendRequest('GET', null, `/documents/${id}`)
      if (res.success) setDocumento(res.data)
      else setError(res.message || 'No se pudo cargar el documento')
      setLoading(false)
    }
    fetchDoc()
  }, [id])

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

  return (
    <section className="dashboard section">
      <div className="row mb-3">
        <div className="col-12">
          <h3>Ficha del Documento</h3>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>

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
                value={documento.FCTM_document_name}
                disabled
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Descripción</label>
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
                value={documento.FCTM_document_type}
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
                    ? new Date(documento.FCTM_inserted_date).toLocaleString()
                    : ''
                }
                disabled
              />
            </div>
            <div className="mb-3">
              <a
                href={getBackendHost() + documento.FCTM_document_url}
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
    </section>
  )
}

export default ShowDocument
