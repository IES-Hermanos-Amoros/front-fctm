import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendRequest } from '../../utils/functions';
import './auth.css';

const VerifyEmailPage = () => {
  const { emailToken } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      setStatus('loading');

      const res = await sendRequest('GET', null, `/auth/verify-email/${emailToken}`);

      if (res.success) {
        if (res.data.status === 'EMAIL_VERIFIED') {
          setStatus('success');
          setMessage(res.data.message || 'Correo verificado correctamente.');

          // Redirigir al login después de 3s
          setTimeout(() => navigate('/'), 3000);
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Error al verificar el correo');
        }
      } else {
        setStatus('error');
        setMessage(res.message || 'Error al verificar el correo');
      }
    };

    verifyEmail();
  }, [emailToken, navigate]);

  return (
    <div className="auth-wrapper">

      <div className="card auth-card auth-verify-card">

        {status === 'loading' && (
          <div className="auth-body auth-center">
            <p className="auth-loading">⏳ Verificando tu correo...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-body auth-center">
            <h2 className="auth-title">Correo verificado ✅</h2>
            <p className="auth-message">{message}</p>
            <p className="auth-note">Redirigiendo al login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="auth-body auth-center">
            <h2 className="auth-title">Error ❌</h2>
            <p className="auth-message">{message}</p>
            <p className="auth-note">Por favor, intenta de nuevo o contacta con soporte.</p>
          </div>
        )}

      </div>

    </div>
  );
};

export default VerifyEmailPage;