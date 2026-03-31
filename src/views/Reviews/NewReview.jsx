import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";
import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

const NewReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fctId = location.state?.fctId;

  const reviewFields = [
    {
      key: "FCTM_review_title",
      label: "Título de la reseña",
      type: "text",
      required: true,
    },
    {
      key: "FCTM_review_text",
      label: "Comentario",
      type: "textarea",
      required: true,
    },
    {
      key: "FCTM_review_rating",
      label: "Calificación",
      type: "select",
      required: true,
      options: [
        { _id: 1, nombre: "1 Estrella" },
        { _id: 2, nombre: "2 Estrellas" },
        { _id: 3, nombre: "3 Estrellas" },
        { _id: 4, nombre: "4 Estrellas" },
        { _id: 5, nombre: "5 Estrellas" },
      ],
      optionValue: "_id",
      optionLabel: "nombre",
    },
  ];

  const [data, setData] = useState({
    FCTM_review_title: "",
    FCTM_review_text: "",
    FCTM_review_rating: 5,
    FCTM_fct_id: "",
  });

  useEffect(() => {
    if (fctId) {
      setData((prev) => ({ ...prev, FCTM_fct_id: fctId }));
    }
  }, [fctId]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!fctId) {
      showAlert("No se ha especificado la FCT", "error");
      return;
    }

    const res = await sendRequest("POST", data, "/reviews");

    if (res.success) {
      navigate(`/fcts/${fctId}`);
    } else {
      showAlert(res.message || "Error al crear la reseña", "error");
    }
  };

  return (
    <section className="dashboard section">
      <ShowHeader
        title="Nueva Reseña"
        onBack={() => navigate(fctId ? `/fcts/${fctId}` : "/fcts")}
      />

      <ShowEditableForm
        formTitle="Nueva Reseña para la FCT"
        formId="reviewForm"
        data={data}
        fields={reviewFields}
        isEditing={true}
        onSave={handleSave}
        onCancel={() => navigate(fctId ? `/fcts/${fctId}` : "/fcts")}
        onChange={handleChange}
      />
    </section>
  );
};

export default NewReview;
