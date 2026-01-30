import React from "react";

const ShowReadonlyForm = ({ data }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <strong>Datos SAO (solo lectura)</strong>
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">SAO ID</label>
          <input
            type="text"
            className="form-control"
            value={data.SAO_id || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            value={data.SAO_username || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={data.SAO_email || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default ShowReadonlyForm;