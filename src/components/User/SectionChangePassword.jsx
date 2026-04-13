import React, { useState, useEffect } from 'react';

const SectionChangePassword = ({ isEditing, onChange }) => {
  const [isModifying, setIsModifying] = useState(false);
  const [pwdData, setPwdData] = useState({
    password: '',
    newPassword: '',
    repeatPassword: ''
  });

  useEffect(() => {
    if (!isEditing) {
      handleCancel();
    }
  }, [isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // CORRECCIÓN CRÍTICA: Primero creamos el objeto con el valor nuevo
    const newData = { ...pwdData, [name]: value };
    
    // Actualizamos el estado local para que el input se mueva visualmente
    setPwdData(newData);
    
    // Enviamos 'newData' (el valor fresco) al padre, NO 'pwdData'
    if (onChange) {
      onChange(isModifying ? newData : null);
    }
  };

  const handleStartModifying = () => {
    setIsModifying(true);
    if (onChange) onChange(pwdData);
  };

  const handleCancel = () => {
    setIsModifying(false);
    const reset = { password: '', newPassword: '', repeatPassword: '' };
    setPwdData(reset);
    if (onChange) onChange(null);
  };

  if (!isEditing) return null;

  return (
    <div className="card mt-4 mb-4 border-warning">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0"><i className="bi bi-shield-lock me-2"></i>Seguridad de la Cuenta</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Contraseña Actual</label>
            <input
              type="password"
              name="password"
              className="form-control"
              // Si no modificamos, mostramos asteriscos. Si sí, el valor real.
              value={isModifying ? pwdData.password : '********'}
              onChange={handleInputChange}
              disabled={!isModifying}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={pwdData.newPassword}
              onChange={handleInputChange}
              disabled={!isModifying}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Repetir Contraseña</label>
            <input
              type="password"
              name="repeatPassword"
              className="form-control"
              value={pwdData.repeatPassword}
              onChange={handleInputChange}
              disabled={!isModifying}
            />
          </div>
        </div>

        <div className="mt-3">
          {!isModifying ? (
            <button type="button" className="btn btn-outline-warning" onClick={handleStartModifying}>
              Cambiar Contraseña
            </button>
          ) : (
            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
              Cancelar Cambio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionChangePassword;