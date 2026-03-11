import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import '../../components/card.css'

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

    console.log("res data de auth/login: ", res.data)

    if (res.success && res.data?.status === 'SUCCESS') {
      console.log('TODO HA IDO GENIAL')
      setLoading(false)

      navigate('/companies')

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

        //console.log("saoRes:", saoRes)
        const userIdMongo = res.data.userId;
        navigate('/auth/password-setup', { state: { saoData: saoRes.data, userIdMongo } })

        return
      }
    }

    setLoading(false)

    showAlert(res.message || 'Error desconocido', 'error')
  }

  return (
    <div className="card login-card">
      <form onSubmit={handleSubmit} className="card-body">
        <h2 className="card-title">Iniciar sesión</h2>
        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="mt-3 text-muted" style={{ fontSize: '0.95em' }}>
          Si es la primera vez que accede, deberá autenticarse con sus
          credenciales de SAO FCT
        </p>
      </form>
    </div>
  )
}

export default Login