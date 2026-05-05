import React, { useState, useEffect } from 'react';

const AccessibilityControl = () => {
  const [zoom, setZoom] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const changeZoom = (amount) => {
    const newZoom = zoom + amount;
    if (newZoom >= 100 && newZoom <= 150) {
      setZoom(newZoom);
      document.documentElement.style.fontSize = `${newZoom}%`;
    }
  };

  return (
    <div className="dropdown ms-3">
      <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
        <i className="bi bi-universal-access"></i>
      </button>
      <ul className="dropdown-menu p-3" style={{ width: '200px' }}>
        <li>
          <label className="form-label small">Tamaño de letra</label>
          <div className="d-flex justify-content-between">
            <button className="btn btn-sm btn-outline-primary" onClick={() => changeZoom(-10)}>A-</button>
            <span className="align-self-center">{zoom}%</span>
            <button className="btn btn-sm btn-outline-primary" onClick={() => changeZoom(10)}>A+</button>
          </div>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" onChange={toggleContrast} checked={highContrast} />
            <label className="form-check-label">Alto Contraste</label>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AccessibilityControl;