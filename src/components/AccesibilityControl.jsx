import React, { useState, useEffect } from 'react';

const AccessibilityControl = () => {
  const [zoom, setZoom] = useState(() => {
    try {
      return parseInt(localStorage.getItem('a11y_zoom') || '100', 10);
    } catch {
      return 100;
    }
  });
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('a11y_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [colorblindMode, setColorblindMode] = useState(() => {
    try {
      return localStorage.getItem('a11y_colorblind') || 'none';
    } catch {
      return 'none';
    }
  });

  const [readableMode, setReadableMode] = useState(() => {
    try {
      return localStorage.getItem('a11y_readable') === 'true';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('a11y_zoom', String(zoom));
    } catch {}
    document.documentElement.style.fontSize = `${zoom}%`;
  }, [zoom]);

  useEffect(() => {
    try {
      localStorage.setItem('a11y_contrast', String(highContrast));
    } catch {}
    document.body.classList.toggle('a11y-high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    try {
      localStorage.setItem('a11y_colorblind', colorblindMode);
    } catch {}
    document.body.classList.remove('a11y-protanopia', 'a11y-deuteranopia', 'a11y-tritanopia');
    if (colorblindMode && colorblindMode !== 'none') {
      document.body.classList.add(`a11y-${colorblindMode}`);
    }
  }, [colorblindMode]);

  useEffect(() => {
    try {
      localStorage.setItem('a11y_readable', String(readableMode));
    } catch {}
    document.body.classList.toggle('a11y-readable', readableMode);
  }, [readableMode]);



  const changeZoom = (amount) => {
    const newZoom = Math.max(100, Math.min(150, zoom + amount));
    setZoom(newZoom);
  };

  const resetAccessibility = () => {
    setZoom(100);
    setHighContrast(false);
    setReadableMode(false);
    try {
      localStorage.removeItem('a11y_zoom');
      localStorage.removeItem('a11y_contrast');
      localStorage.removeItem('a11y_readable');
    } catch {}
  };

  return (
    <div className="dropdown accessibility-control">
      <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-label="Abrir opciones de accesibilidad">
        <i className="bi bi-universal-access"></i>
      </button>
      <ul className="dropdown-menu p-3" style={{ width: '240px' }}>
        <li>
          <label className="form-label small">Tamaño de letra</label>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-sm btn-outline-primary" onClick={() => changeZoom(-10)} disabled={zoom <= 100} aria-label="Reducir texto">A-</button>
            <span className="align-self-center fw-bold">{zoom}%</span>
            <button className="btn btn-sm btn-outline-primary" onClick={() => changeZoom(10)} disabled={zoom >= 150} aria-label="Aumentar texto">A+</button>
          </div>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="contrast-toggle" onChange={() => setHighContrast(!highContrast)} checked={highContrast} />
            <label className="form-check-label" htmlFor="contrast-toggle">Alto contraste</label>
          </div>
        </li>
        <li>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="readable-toggle" onChange={() => setReadableMode(!readableMode)} checked={readableMode} />
            <label className="form-check-label" htmlFor="readable-toggle">Modo lectura</label>
          </div>
        </li>
        <li>
          <label className="form-label small">Visión de color</label>
          <select className="form-select form-select-sm" value={colorblindMode} onChange={(e) => setColorblindMode(e.target.value)}>
            <option value="none">Normal</option>
            <option value="protanopia">Protanopía</option>
            <option value="deuteranopia">Deuteranopía</option>
            <option value="tritanopia">Tritanopía</option>
          </select>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="btn btn-outline-secondary btn-sm w-100" onClick={resetAccessibility}>Restablecer</button>
        </li>
      </ul>
    </div>
  );
};

export default AccessibilityControl;