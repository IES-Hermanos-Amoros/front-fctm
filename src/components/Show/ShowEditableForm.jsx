import React from "react";

const ShowEditableForm = ({
  formTitle,
  formId,
  data,
  fields,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  hideEditButton = false   // <-- NUEVO
}) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // evitamos recarga
    if (onSave) onSave();
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>{formTitle}</strong>

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
              form={formId}
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
        <form id={formId} onSubmit={handleSubmit}>

          {fields.map((field) => {
          const {
            key,
            label,
            type = "text",
            options = [],
            optionValue = "_id",
            optionLabel = "nombre"
          } = field

          return (
            <div className="mb-3" key={key}>
              <label className="form-label">{label}</label>

              {(() => {
                  if (type === "select") {
                    return (
                      <select
                        className="form-select"
                        value={
                          typeof data[key] === "object" && data[key] !== null
                            ? data[key][optionValue]
                            : data[key] || ""
                        }
                        onChange={e => onChange(key, e.target.value)}
                        disabled={!isEditing}
                        required
                      >
                        <option value="">-- Selecciona --</option>

                        {options.map(opt => (
                          <option
                            key={opt[optionValue]}
                            value={opt[optionValue]}
                          >
                            {opt[optionLabel]}
                          </option>
                        ))}
                      </select>
                    )
                  }

                  if (type === "textarea") {
                    return (
                      <textarea
                        className="form-control"
                        value={
                          typeof data[key] === "object" && data[key] !== null
                            ? data[key][optionLabel] || ""
                            : data[key] || ""
                        }
                        onChange={e => onChange(key, e.target.value)}
                        required
                        readOnly={!isEditing}
                        rows={4}
                      />
                    )
                  }

                  // Por defecto: input normal
                  return (
                    <input
                      className="form-control"
                      type={type}
                      value={
                        typeof data[key] === "object" && data[key] !== null
                          ? data[key][optionLabel] || ""
                          : data[key] || ""
                      }
                      onChange={e => onChange(key, e.target.value)}
                      required
                      readOnly={!isEditing}
                    />
                  )
                })()}

            </div>
          )
        })}

          {/*<div className="mb-3">
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
          </div>*/}
        </form>
      </div>
    </div>
  );
};

export default ShowEditableForm;