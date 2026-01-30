import React from "react";

const ShowHeader = ({ title, onBack }) => {
  return (
    <div className="d-flex align-items-center mb-3">
      {onBack && (
        <button className="btn btn-outline-secondary me-2" onClick={onBack}>
          Volver
        </button>
      )}
      <h2 className="m-0">{title}</h2>
    </div>
  );
};

export default ShowHeader;