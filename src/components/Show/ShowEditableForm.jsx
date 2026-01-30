import React from "react";

const ShowEditableForm = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange
}) => {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>Datos FCTM</strong>

        {!isEditing ? (
          // ===== MODO SHOW =====
          <button className="btn btn-primary" onClick={onEdit}>
            Editar
          </button>
        ) : (
          // ===== MODO EDIT =====
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={onSave}>
              Guardar
            </button>

            <button className="btn btn-outline-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-control"
            value={data.FCTM_dummy_observations || ""}
            readOnly={!isEditing}
            onChange={e =>
              onChange("FCTM_dummy_observations", e.target.value)
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Otro contacto</label>
          <input
            type="text"
            className="form-control"
            value={data.FCTM_dummy_other_contact || ""}
            readOnly={!isEditing}
            onChange={e =>
              onChange("FCTM_dummy_other_contact", e.target.value)
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            value={data.FCTM_dummy_description || ""}
            readOnly={!isEditing}
            onChange={e =>
              onChange("FCTM_dummy_description", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ShowEditableForm;