import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  formatDateDDMMYYYY,
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import RatingStars from "../../components/RatingStars";

const ShowReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fctId = location.state?.fctId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const res = await sendRequest("PUT", data, `/reviews/${id}`);

    if (res.success) {
      setIsEditing(false);
      fetchReview();
    } else {
      showAlert(res.message || "Error al actualizar la reseña", "error");
    }
  };

  const camposMostrar = [
    { key: "FCTM_review_title", label: "Título", type: "text" },
    {
      key: "FCTM_review_rating",
      label: "Calificación",
      type: "text",
      render: (data) => (data ? <RatingStars rating={data} /> : "-"),
    },
    {
      key: "FCTM_user_id",
      label: "Autor",
      type: "text",
      render: (data) => data?.SAO_name || "Desconocido",
    },
    { key: "FCTM_review_text", label: "Comentario", type: "textarea" },
    {
      key: "FCTM_review_date",
      label: "Fecha",
      type: "text",
      render: (data) => formatDateDDMMYYYY(data),
    },
    {
      key: "FCTM_review_verified",
      label: "Verificada",
      type: "text",
      render: (data) => (data ? "Sí" : "No"),
    },
  ];

  const camposEditar = [
    { key: "FCTM_review_title", label: "Título", type: "text", required: true },
    {
      key: "FCTM_review_rating",
      label: "Calificación",
      type: "stars",
      required: true,
    },
    {
      key: "FCTM_review_text",
      label: "Comentario",
      type: "textarea",
      required: true,
    },
  ];

  if (loading) return <p className="p-5 text-center">Cargando reseña...</p>;
  if (!data) return <p className="p-5 text-center">Reseña no encontrada</p>;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Reseña: ${data.FCTM_review_title || "Detalle"}`}
        onBack={() => navigate(fctId ? `/fcts/${fctId}` : "/fcts")}
      />

      <ShowEditableForm
        formTitle={isEditing ? "Editar Reseña" : "Detalles de la Reseña"}
        formId="reviewForm"
        data={data}
        fields={isEditing ? camposEditar : camposMostrar}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          fetchReview();
        }}
        onChange={handleChange}
      />
    </section>
  );
};

export default ShowReview;
