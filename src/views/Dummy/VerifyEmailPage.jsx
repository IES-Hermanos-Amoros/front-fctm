import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendRequest } from '../../utils/functions';
import axios from 'axios'

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
          setTimeout(() => navigate('/login'), 3000);
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
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {status === 'loading' && <p>⏳ Verificando tu correo...</p>}
      {status === 'success' && (
        <>
          <h2>✅ Correo verificado</h2>
          <p>{message}</p>
          <p>Redirigiendo al login...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>❌ Error</h2>
          <p>{message}</p>
          <p>Por favor, intenta de nuevo o contacta con soporte.</p>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;