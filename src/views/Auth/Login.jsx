import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import './auth.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!username || !password) {
      console.log('NO HAY USERNAME O PASSWORD')
      showAlert('Por favor, rellene todos los campos', 'error')
      return
    }

    setLoading(true)

    const res = await sendRequest('POST', { username, password }, '/auth/login')

    console.log('res data de auth/login: ', res.data)

    if (res.success && res.data?.status === 'SUCCESS') {
      console.log('TODO HA IDO GENIAL... ', res.data)
      setLoading(false)

      switch (res.data.user.profile) {
        case 'ADMINISTRADOR':
          navigate('/administrators/' + res.data.user._id)
          break
        case 'PROFESOR':
          navigate('/teachers/' + res.data.user._id)
          break
        case 'ALUMNO':
          navigate('/students/' + res.data.user._id)
          break
        case 'EMPRESA':
          navigate('/companies/' + res.data.user._id)
          break
        default:
          navigate('/companies')
      }

      return
    }

    if (
      res.data &&
      ['SAO_NEWUSER_FCTM_REQUIRED', 'SAO_REQUIRED', 'FIRST_LOGIN'].includes(
        res.data.status
      )
    ) {
      console.log(
        'EL LOGIN ES CORRECTO, PERO HAY QUE REGISTRARSE POR PRIMERA VEZ'
      )

      const saoRes = await sendRequest(
        'POST',
        { username, password },
        '/sao/login'
      )

      if (!saoRes.success) {
        setLoading(false)
        showAlert(saoRes.message || 'Error autenticando con SAO', 'error')
        return
      }

      if (res.data.status === 'SAO_NEWUSER_FCTM_REQUIRED') {
        const regRes = await sendRequest(
          'POST',
          saoRes.data,
          '/auth/register-from-sao'
        )

        if (!regRes.success) {
          setLoading(false)
          showAlert(regRes.message || 'Error registrando usuario', 'error')
          return
        }

        setLoading(false)

        navigate('/auth/password-setup', { state: { saoData: regRes.data } })

        return
      }

      if (['SAO_REQUIRED', 'FIRST_LOGIN'].includes(res.data.status)) {
        setLoading(false)

        const userIdMongo = res.data.userId

        navigate('/auth/password-setup', {
          state: { saoData: saoRes.data, userIdMongo },
        })

        return
      }
    }

    setLoading(false)

    showAlert(res.message || 'Error desconocido', 'error')
  }

  return (
    <div className="auth-wrapper">

      <div className="card auth-card">

        <div className="auth-header">
          <i className="bi bi-shield-lock auth-logo"></i>
          <h2 className="auth-title">Acceso FCT Manager</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-body">

          <div className="auth-group">
            <label>Usuario</label>

            <div className="auth-input-group">
              <i className="bi bi-person auth-input-icon"></i>

              <input
                type="text"
                className="auth-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-group">
            <label>Contraseña</label>

            <div className="auth-input-group">
              <i className="bi bi-lock auth-input-icon"></i>

              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="auth-links">
            <a href="#">¿Olvidaste la contraseña?</a>
          </div>

          <p className="auth-footer">
            Si es la primera vez que accede, deberá autenticarse con sus credenciales de SAO FCT
          </p>

        </form>

      </div>

    </div>
  )
}

export default Login