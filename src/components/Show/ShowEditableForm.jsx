import React from "react";

const ShowEditableForm = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  hideEditButton = false   // <-- NUEVO
}) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // evitamos recarga
    onSave();
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>Datos FCTM</strong>

        {/* ===== BOTONERA (MISMA ORGANIZACIÓN QUE TENÍAS) ===== */}

        {/* MODO SHOW */}
        {!isEditing && !hideEditButton && (
          <button className="btn btn-primary" onClick={onEdit}>
            Editar
          </button>
        )}

        {/* MODO EDIT */}
        {isEditing && (
          <div className="d-flex gap-2">
            <button
              type="submit"
              form="editableForm"
              className="btn btn-success"
            >
              Guardar
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="card-body">
        <form id="editableForm" onSubmit={handleSubmit}>
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
        </form>
      </div>
    </div>
  );
};

export default ShowEditableForm;