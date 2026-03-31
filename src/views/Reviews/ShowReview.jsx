import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { sendRequest, showAlert, formatDateDDMMYYYY } from "../../utils/functions";

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

  const camposMostrar = [
    { key: "FCTM_review_title", label: "Título", type: "text" },
    {
      key: "FCTM_review_rating",
      label: "Calificación",
      type: "text",
      render: (data) => data ? <RatingStars rating={data} /> : "-"
    },
    {
      key: "FCTM_user_id",
      label: "Autor",
      type: "text",
      render: (data) => data?.SAO_name || "Desconocido"
    },
    { key: "FCTM_review_text", label: "Comentario", type: "textarea" },
    { 
      key: "FCTM_review_date", 
      label: "Fecha", 
      type: "text",
      render: (data) => formatDateDDMMYYYY(data)
    },
    {
      key: "FCTM_review_verified",
      label: "Verificada",
      type: "text",
      render: (data) => data ? "Sí" : "No"
    }
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
        formTitle="Detalles de la Reseña"
        formId="reviewForm"
        data={data}
        fields={camposMostrar}
        hideEditButton={true}
      />
    </section>
  );
};

export default ShowReview;
