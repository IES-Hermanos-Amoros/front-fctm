import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import ShowHeader from '../../components/Show/ShowHeader'
import useUserStore from '../../store/userStore'

const StarRating = ({ value, onChange, disabled = false }) => {
  const [hover, setHover] = useState(0)

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          style={{
            cursor: disabled ? 'default' : 'pointer',
            fontSize: '1.5rem',
            color: star <= (hover || value) ? '#ffc107' : '#dee2e6'
          }}
        >
          <i className={`bi ${star <= (hover || value) ? 'bi-star-fill' : 'bi-star'}`}></i>
        </span>
      ))}
    </div>
  )
}

const NewReview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useUserStore((state) => state.user)
  const loading = useUserStore((state) => state.loading)
  const fetchUser = useUserStore((state) => state.fetchUser)

  const fctId = location.state?.fctId || null
  const returnPath = fctId ? `/fcts/${fctId}` : '/'

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [user, fetchUser])

  if (loading) {
    return <p className="p-5 text-center">Cargando usuario...</p>
  }

  const [data, setData] = useState({
    FCTM_review_title: '',
    FCTM_review_text: '',
    FCTM_review_rating: 0,
  })

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    console.log("=== HANDLE SAVE ===")
    console.log("user:", user)
    console.log("user.id:", user?.id)
    
    if (!data.FCTM_review_title.trim()) {
      showAlert('Por favor, introduce un título para la reseña.', 'error')
      return
    }

    if (data.FCTM_review_rating < 1 || data.FCTM_review_rating > 5) {
      showAlert('Por favor, selecciona una calificación de 1 a 5 estrellas.', 'error')
      return
    }

    if (!data.FCTM_review_text.trim()) {
      showAlert('Por favor, introduce un comentario para la reseña.', 'error')
      return
    }

    if (!user?.user?.id) {
      showAlert('No se ha podido identificar al usuario. Recarga la página.', 'error')
      return
    }

    const payload = {
      ...data,
      FCTM_user_id: user.user.id,
      FCTM_review_verified: false,
      fctId
    }

    console.log("Payload a enviar:", payload)
    console.log("User del store:", user)
    const res = await sendRequest('POST', payload, '/reviews')
    if (res.success) {
      navigate(returnPath)
    }
  }

  return (
    <section className="dashboard section">
      <ShowHeader
        title="Nueva Reseña"
        onBack={() => navigate(returnPath)}
      />

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Alta de Reseña</strong>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(returnPath)}
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">
              Título <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={data.FCTM_review_title}
              onChange={e => handleChange('FCTM_review_title', e.target.value)}
              placeholder="Título de tu reseña"
              maxLength={100}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Calificación <span className="text-danger">*</span>
            </label>
            <div>
              <StarRating
                value={data.FCTM_review_rating}
                onChange={(rating) => handleChange('FCTM_review_rating', rating)}
              />
              <small className="text-muted ms-2">
                {data.FCTM_review_rating > 0 
                  ? `${data.FCTM_review_rating} estrella${data.FCTM_review_rating !== 1 ? 's' : ''}`
                  : 'Selecciona una calificación'}
              </small>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Comentario <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              value={data.FCTM_review_text}
              onChange={e => handleChange('FCTM_review_text', e.target.value)}
              placeholder="Cuéntanos tu experiencia en esta FCT..."
              rows={5}
              maxLength={1000}
            />
            <small className="text-muted">
              {data.FCTM_review_text.length}/1000 caracteres
            </small>
          </div>

          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Tu reseña quedará pendiente de validación antes de ser publicada.
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewReview
