import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'

const documentTypes = [
  { _id: 'GENERAL', nombre: 'GENERAL' },
  { _id: 'MANUAL', nombre: 'MANUAL' },
  { _id: 'DECRETO/ORDEN/CURRÍCULUM', nombre: 'DECRETO/ORDEN/CURRÍCULUM' },
  { _id: 'CURRÍCULUM VITAE', nombre: 'CURRÍCULUM VITAE' },
  { _id: 'OTRO', nombre: 'OTRO' },
  { _id: 'AVATAR', nombre: 'AVATAR' },
]

const NewDocument = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    description: '',
    type: 'GENERAL',
    file: null,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setData(prev => ({ ...prev, file: files[0] }))
    } else {
      setData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!data.file) {
      showAlert('Debes adjuntar un archivo.', 'error')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('files', data.file)
      const res = await sendRequest('POST', formData, '/documents/upload', {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.success) {
        showAlert('Documento creado correctamente', 'success')
        navigate('/documents')
      } else {
        showAlert(res.message || 'Error al crear documento', 'error')
      }
    } catch (err) {
      showAlert(err.message || 'Error al crear documento', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Nuevo Documento</h4>
            </div>
            <form className="p-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="description">
                  Descripción
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="type">
                  Tipo
                </label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={data.type}
                  onChange={handleChange}
                  required
                >
                  {documentTypes.map(opt => (
                    <option key={opt._id} value={opt._id}>
                      {opt.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="file">
                  Adjuntar archivo (PDF, DOC, etc.)
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/documents')}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewDocument
