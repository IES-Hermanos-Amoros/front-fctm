import React, { useState, useEffect } from 'react';
import { validateStrongPassword } from "../../utils/functions" // Asumiendo que existe allí

const SectionChangePassword = ({ isEditing, onChange }) => {
  const [isModifying, setIsModifying] = useState(false);
  const [pwdData, setPwdData] = useState({
    password: '',
    newPassword: '',
    repeatPassword: ''
  });

  // Si salimos del modo edición general, reseteamos el estado interno
  useEffect(() => {
    if (!isEditing) {
      handleCancel();
    }
  }, [isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...pwdData, [name]: value };
    setPwdData(newData);
    
    // Notificamos al padre (ShowCompany) los nuevos valores
    // Pasamos null si no estamos modificando para que no se envíen en el PATCH
    onChange(isModifying ? newData : null);
  };

  const handleStartModifying = () => {
    setIsModifying(true);
    onChange(pwdData);
  };

  const handleCancel = () => {
    setIsModifying(false);
    setPwdData({ password: '', newPassword: '', repeatPassword: '' });
    onChange(null);
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
              placeholder="********"
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