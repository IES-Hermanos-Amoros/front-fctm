import React from "react";
import RatingStars from "../RatingStars";

const ShowReadonlyForm = ({ data, fields }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <strong>Datos SAO (solo lectura)</strong>
      </div>

      <div className="card-body">
        {fields.map((field) => {
          const {
            key,
            label,
            type = "text",
            options = [],
            optionValue = "_id",
            optionLabel = "nombre",
          } = field;

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
                      onChange={(e) => onChange(key, e.target.value)}
                      disabled={!isEditing}
                      required
                    >
                      <option value="">-- Selecciona --</option>

                      {options.map((opt) => (
                        <option key={opt[optionValue]} value={opt[optionValue]}>
                          {opt[optionLabel]}
                        </option>
                      ))}
                    </select>
                  );
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
                      onChange={(e) => onChange(key, e.target.value)}
                      required
                      readOnly={!isEditing}
                      rows={4}
                    />
                  );
                }

                if (type === "stars") {
                  const rating = data[key] || 0;
                  return (
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: "1.5rem",
                            color: star <= rating ? "#ffc107" : "#dee2e6",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  );
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
                    onChange={(e) => onChange(key, e.target.value)}
                    required
                    readOnly={!isEditing}
                  />
                );
              })()}
            </div>
          );
        })}

        {/*<div className="mb-3">
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
        </div>*/}
      </div>
    </div>
  );
};

export default ShowReadonlyForm;
