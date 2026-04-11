import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { sendRequest, showAlert } from "../../utils/functions";
import ShowHeader from "../../components/Show/ShowHeader";
import useUserStore from "../../store/userStore";

const ShowReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  // Id del usuario logueado: se usa para FCTM_user_id al guardar, sin mostrarlo en pantalla.
  const loggedUserId = useMemo(() => {
    return user?._id || user?.id || user?.user?._id || user?.user?.id || null;
  }, [user]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Carga inicial de la reseña por ID para modo Show/Edit.
  const fetchReview = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await sendRequest("GET", null, `/reviews/${id}`);

    if (res.success) {
      setData(res.data);
      setOriginalData(res.data);
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    const rating = Number(data?.FCTM_review_rating);

    if (!data?.FCTM_review_title?.trim()) {
      showAlert("El titulo es obligatorio", "error");
      return;
    }

    if (!data?.FCTM_review_text?.trim()) {
      showAlert("El comentario es obligatorio", "error");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      showAlert("La calificacion debe estar entre 1 y 5", "error");
      return;
    }

    if (!loggedUserId) {
      showAlert("No se pudo identificar al usuario logueado", "error");
      return;
    }

    // Solo enviamos los campos de negocio requeridos en la edición de reseñas.
    const payload = {
      FCTM_review_title: data.FCTM_review_title,
      FCTM_review_rating: rating,
      FCTM_review_text: data.FCTM_review_text,
      FCTM_user_id: loggedUserId,
    };

    const res = await sendRequest("PATCH", payload, `/reviews/${id}`);

    if (res.success) {
      const updatedReview = res.data?.review || res.data;
      setData(updatedReview);
      setOriginalData(updatedReview);
      setIsEditing(false);
    } else {
      showAlert(res.message, "error");
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  const handleBack = () => {
    if (location.state?.returnPath) {
      navigate(location.state.returnPath);
      return;
    }

    navigate(-1);
  };

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  if (loading) return <p className="p-5 text-center">Cargando resena...</p>;
  if (!data) return <p className="p-5 text-center">No se encontro la resena</p>;

  // Valor actual para pintar estrellas activas/inactivas.
  const currentRating = Number(data?.FCTM_review_rating) || 0;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Ficha de resena: ${data?.FCTM_review_title || "Detalle"}`}
        onBack={handleBack}
      />

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Informacion de la resena</strong>

          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Editar
            </button>
          )}

          {isEditing && (
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-success" onClick={handleSave}>
                Guardar
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">
              Titulo <span className="text-danger">*</span>
            </label>
            {/* FCTM_review_title -> Titulo */}
            <input
              className="form-control"
              type="text"
              value={data?.FCTM_review_title || ""}
              onChange={(e) => handleChange("FCTM_review_title", e.target.value)}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Calificacion (Estrellas) <span className="text-danger">*</span>
            </label>
            {/* FCTM_review_rating -> Pintado de estrellas (1 a 5) */}
            <div className="d-flex align-items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isActive = starValue <= currentRating;

                if (isEditing) {
                  // En edición, cada estrella es clicable para cambiar la calificación.
                  return (
                    <button
                      key={starValue}
                      type="button"
                      className="btn btn-link p-0 border-0"
                      onClick={() => handleChange("FCTM_review_rating", starValue)}
                      aria-label={`Calificar con ${starValue} estrella${starValue > 1 ? "s" : ""}`}
                    >
                      <i className={`bi ${isActive ? "bi-star-fill text-warning" : "bi-star text-muted"}`} />
                    </button>
                  );
                }

                return (
                  <i
                    key={starValue}
                    className={`bi ${isActive ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
                    aria-hidden="true"
                  />
                );
              })}
              <span className="text-muted">{currentRating}/5</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Comentario <span className="text-danger">*</span>
            </label>
            {/* FCTM_review_text -> Comentario (Text Area) */}
            <textarea
              className="form-control"
              rows={4}
              value={data?.FCTM_review_text || ""}
              onChange={(e) => handleChange("FCTM_review_text", e.target.value)}
              readOnly={!isEditing}
              required
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowReview;
