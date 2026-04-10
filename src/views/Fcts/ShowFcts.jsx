import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, normalizeFromApi, normalizeToApi, formatDateDDMMYYYY, confirmation } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import RatingStars from "../../components/RatingStars";

// --- CONFIGURACIÓN DE CAMPOS ---

// Campos SAO (Solo lectura)
const SAO_fields = [
  { key: "SAO_fct_id", label: "ID FCT", type: "text" },
  { key: "SAO_student_course", label: "Curso Alumno", type: "text" },
  { key: "SAO_student_id", label: "NIA", type: "text" },
  { key: "SAO_student_fullname", label: "Alumno", type: "text" },
  { key: "SAO_company_id", label: "CIF Empresa", type: "text" },
  { key: "SAO_company_name", label: "Empresa", type: "text" },
  { key: "SAO_company_city", label: "Localidad", type: "text" },
  { key: "SAO_workcenter_name", label: "Centro de Trabajo", type: "text" },
  { key: "SAO_workcenter_phone", label: "Teléfono Centro", type: "text" },
  { key: "SAO_workcenter_manager", label: "Responsable Centro", type: "text" },
  { key: "SAO_workcenter_manager_id", label: "ID Responsable Centro", type: "text" },
  { key: "SAO_workcenter_email", label: "Email Centro", type: "email" },
  { key: "SAO_teacher_id", label: "NIF Profesor", type: "text" },
  { key: "SAO_teacher_fullname", label: "Tutor Curso", type: "text" },
  { key: "SAO_instructor_id", label: "ID Instructor Empresa", type: "text" },
  { key: "SAO_instructor_name", label: "Instructor Empresa", type: "text" },
  { key: "SAO_period", label: "Curso / Periodo", type: "text" },
  { key: "SAO_dates", label: "Fechas", type: "text" },
  { key: "SAO_schedule", label: "Horario", type: "text" },
  { key: "SAO_hours", label: "Horas", type: "text" },
  { key: "SAO_department", label: "Departamento", type: "text" },
  { key: "SAO_type", label: "Tipo FCT", type: "text" },
  { key: "SAO_Authorization", label: "Autorización", type: "text" },
  { key: "SAO_Erasmus", label: "Erasmus", type: "text" },
  { key: "SAO_termination_date", label: "Fecha Finalización", type: "text" },
  { key: "SAO_instructor_assessment", label: "Valoración Instructor", type: "text" },
  { key: "SAO_variation", label: "Variación", type: "text" },
  { key: "SAO_link", label: "Enlace", type: "text" },
  { key: "SAO_amount", label: "Importe", type: "text" },
  { key: "SAO_observation", label: "Observaciones SAO", type: "textarea" },
];

// Campos FCTM (Editables)
const FCTM_fields = [
  { key: "FCTM_ies_instructor", label: "Tutor IES", type: "text" },
  { key: "FCTM_notes", label: "Notas Internas", type: "textarea" },
];

const ShowFcts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // --- CARGA DE DATOS ---
  const fetchFct = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/fct/${id}`);

    if (res.success) {
      // Si tuvieras select-multi usaríamos normalizeFromApi aquí
      setData(res.data);
      setOriginalData(res.data);
    } else {
      showAlert(res.message, "error");
    }
    setLoading(false);
  }, [id]);

  // --- FUNCIONES DE RESEÑAS ---
  const handleDeleteReview = useCallback(async (reviewId) => {
    const confirmed = await confirmation("¿Seguro que quieres eliminar esta reseña?");
    if (!confirmed) return;

    const res = await sendRequest("DELETE", undefined, `/reviews/${reviewId}`);

    if (res.success) {
      showAlert("Reseña eliminada correctamente", "success");
      fetchFct();
    } else {
      showAlert(res.message || "Error al eliminar la reseña", "error");
    }
  }, [fetchFct]);

  const columnasReviews = useMemo(() => [
    { key: "FCTM_review_title", encabezado: "Título" },
    {
      key: "FCTM_review_rating",
      encabezado: "Calificación",
      render: (row) => <RatingStars rating={row.FCTM_review_rating} />
    },
    {
      key: "FCTM_user_id",
      encabezado: "Autor",
      render: (row) => row.FCTM_user_id?.SAO_name || "Desconocido"
    },
    {
      key: "FCTM_review_text",
      encabezado: "Comentario",
      render: (row) => {
        const text = row.FCTM_review_text || "";
        return text.length > 80 ? text.substring(0, 80) + "..." : text;
      }
    },
    {
      key: "FCTM_review_date",
      encabezado: "Fecha",
      render: (row) => formatDateDDMMYYYY(row.FCTM_review_date)
    },
    {
      key: "__show",
      encabezado: "Ver",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate(`/reviews/${row._id}`, { state: { fctId: id } })}
          title="Ver detalles"
        >
          <i className="bi bi-search"></i>
        </button>
      )
    },
    {
      key: "__delete",
      encabezado: "Eliminar",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteReview(row._id)}
          title="Eliminar reseña"
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ], [navigate, id, handleDeleteReview]);

  // --- GUARDADO ---
  const handleSave = async () => {
    // Filtramos para enviar solo lo que empieza por FCTM_ (opcional, según backend)
    const payload = {};
    Object.keys(data).forEach(key => {
        if(key.startsWith('FCTM_')) payload[key] = data[key];
    });

    const res = await sendRequest("PATCH", payload, `/fct/${id}`);

    if (res.success) {
      setData(res.data);
      setOriginalData(res.data);
      setIsEditing(false);
      showAlert("FCT actualizada correctamente", "success");
    } else {
      showAlert(res.message, "error");
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchFct();
  }, [fetchFct]);

  if (loading) return <p className="p-5 text-center">Cargando FCT...</p>;
  if (!data) return <p className="p-5 text-center">No se encontró la FCT</p>;

  return (
    <section className="dashboard section">
      <ShowHeader 
        title={`FCT: ${data.SAO_student_fullname || "Detalle"}`} 
        onBack={() => navigate("/fcts")} 
      />

      {/* SECCIÓN SAO: Siempre bloqueada */}
      <ShowEditableForm
        formTitle="Información de SAO (Solo Lectura)"
        formId="saoForm"
        data={data}
        fields={SAO_fields}
        hideEditButton={true} // Forzamos que no aparezca el botón de editar
      />

      {/* SECCIÓN FCTM: Editable */}
      <ShowEditableForm
        formTitle="Gestión de Tutoría"
        formId="fctmForm"
        data={data}
        fields={FCTM_fields}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      {/* SECCIÓN RESEÑAS */}
      <div className="card mt-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Reseñas</strong>
          
        </div>
        <div className="card-body">
          {data.FCTM_reviews && data.FCTM_reviews.length > 0 ? (
            <p className="text-muted mb-0"> ({data.FCTM_reviews.length}) reseñas</p>
          ) : (
            <p className="text-muted mb-0">No hay reseñas todavía.</p>
          )}
        </div>
      </div>
      <hr />

      <ListCRUD
        title="Reseñas Verificadas"
        datos={data.FCTM_reviews || []}
        columnas={columnasReviews}
      >
        <button
          className="btn btn-primary"
          onClick={() => navigate('/reviews/new', { state: { fctId: id } })}
        >
          Nueva Reseña
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowFcts;