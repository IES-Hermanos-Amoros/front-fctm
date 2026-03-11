import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import '../../components/card.css'

const PasswordSetup = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const saoData = location.state?.saoData || {}
  const userIdMongo = location.state?.userIdMongo || null
  // Prioridad: SAO_email > FCTM_contact_email > email
  const initialEmail =
    saoData.SAO_email || saoData.FCTM_contact_email || saoData.email || ''
  const [email, setEmail] = useState(initialEmail)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRep, setNewPasswordRep] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!newPassword || !newPasswordRep || !email) {
      showAlert('Todos los campos son obligatorios', 'error')
      return
    }

    if (newPassword !== newPasswordRep) {
      showAlert('Las contraseñas no coinciden', 'error')
      return
    }

    setLoading(true)

    const res = await sendRequest(
      'POST',
      {
        userId: userIdMongo,//saoData.SAO_id,
        newPassword,
        newPasswordRep,
        email,
      },
      '/auth/complete-first-login'
    )

    setLoading(false)

    //console.log(res)

    if (res.success && res.data?.status === 'SUCCESS') {
      showAlert('Contraseña actualizada correctamente', 'success')
      navigate('/')
    } else if (
      res.data.err ===
      'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial'
    ) {
      showAlert(res.data.err, 'error')
    } else {
      //showAlert(res.message || 'Error al actualizar contraseña', 'error')
      showAlert(res.message || 'Error al actualizar contraseña', 'success')
    }
  }

  return (
    <div className="card login-card">
      <form onSubmit={handleSubmit} className="card-body">
        <h2 className="card-title">Configurar nueva contraseña</h2>
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Repetir contraseña</label>
          <input
            type="password"
            className="form-control"
            value={newPasswordRep}
            onChange={e => setNewPasswordRep(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email de contacto</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}

export default PasswordSetup