import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sendRequest, showAlert, validateStrongPassword } from '../../utils/functions'
import './auth.css'

const PasswordChange = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRep, setNewPasswordRep] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!newPassword || !newPasswordRep) {
      showAlert('Todos los campos son obligatorios', 'error')
      return
    }

    if (!validateStrongPassword(newPassword)) {
      showAlert(
        'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial',
        'error'
      )
      return
    }

    if (newPassword !== newPasswordRep) {
      showAlert('Las contraseñas no coinciden', 'error')
      return
    }

    setLoading(true)

    const res = await sendRequest(
      'POST',
      { newPassword, newPasswordRep },
      `/auth/change-password/${token}`
    )

    setLoading(false)

    if (res.success && res.data?.status === 'SUCCESS') {
      navigate('/')
    }
  }

  return (
    <div className="auth-wrapper">

      <div className="card auth-card">

        <div className="auth-header">
          <i className="bi bi-key auth-logo"></i>
          <h2 className="auth-title">Nueva contraseña</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-body">

          <div className="auth-group">
            <label>Nueva contraseña</label>

            <div className="auth-input-group">
              <i className="bi bi-lock auth-input-icon"></i>

              <input
                type="password"
                className="auth-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-group">
            <label>Repetir contraseña</label>

            <div className="auth-input-group">
              <i className="bi bi-shield-lock auth-input-icon"></i>

              <input
                type="password"
                className="auth-input"
                value={newPasswordRep}
                onChange={e => setNewPasswordRep(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default PasswordChange
