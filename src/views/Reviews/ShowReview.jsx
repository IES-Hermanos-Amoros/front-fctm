import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  confirmation,
  formatDateDDMMYYYY,
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import RatingStars from "../../components/RatingStars";

const ShowReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fctId = location.state?.fctId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReview = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/reviews/${id}`);

    if (res.success) {
      setData(res.data);
    } else {
      showAlert(res.message, "error");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleDelete = async () => {
    const confirmed = await confirmation(
      "¿Seguro que quieres eliminar esta reseña?"
    );
    if (!confirmed) return;

    const res = await sendRequest("DELETE", null, `/reviews/${id}`);
    if (res.success) {
      showAlert("Reseña eliminada correctamente", "success");
      navigate(fctId ? `/fcts/${fctId}` : "/fcts");
    } else {
      showAlert(res.message || "Error al eliminar reseña", "error");
    }
  };

  if (loading) return <p className="p-5 text-center">Cargando...</p>;
  if (!data) return <p className="p-5 text-center">No se encontró la reseña</p>;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={data.FCTM_review_title || "Detalle Reseña"}
        onBack={() => navigate(fctId ? `/fcts/${fctId}` : "/fcts")}
      />

      <div className="card mt-3">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Título:</div>
            <div className="col-md-9">{data.FCTM_review_title}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Calificación:</div>
            <div className="col-md-9">
              <RatingStars rating={data.FCTM_review_rating} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Autor:</div>
            <div className="col-md-9">
              {data.FCTM_user_id?.SAO_fullname ||
                `${data.FCTM_user_id?.SAO_name || ""} ${data.FCTM_user_id?.SAO_surname || ""}`.trim() ||
                "Desconocido"}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Fecha:</div>
            <div className="col-md-9">
              {formatDateDDMMYYYY(data.FCTM_review_date)}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Comentario:</div>
            <div className="col-md-9">{data.FCTM_review_text}</div>
          </div>

          <div className="mt-4">
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Eliminar Reseña
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowReview;