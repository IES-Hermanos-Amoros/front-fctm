import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  normalizeFromApi,
  normalizeToApi,
  getBackendHost,
  formatDateDDMMYYYYHHmm
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";

const ACTION_FIELDS = [
  { key: "FCTM_action_title", label: "Título de la Acción", type: "text" },
  { key: "FCTM_action_datetime", label: "Fecha y Hora", type: "date" },
  {
    key: "FCTM_action_type",
    label: "Tipo de Acción",
    type: "select",
    options: [
      { _id: "VISITA", nombre: "Visita" },
      { _id: "LLAMADA", nombre: "Llamada" },
      { _id: "EMAIL", nombre: "Email" },
      { _id: "REUNION", nombre: "Reunión" }
    ],
    optionValue: "_id",
    optionLabel: "nombre"
  },
  { key: "FCTM_action_notes", label: "Notas / Observaciones", type: "textarea" },
];

const normalizationConfig = [
  { field: "FCTM_action_datetime", type: "date" }
];

const ShowAction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hostAPI = getBackendHost();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const columnasDocuments = [
    { key: "FCTM_document_name", encabezado: "Nombre" },
    { key: "FCTM_document_type", encabezado: "Tipo" },
    {
      key: "FCTM_document_url",
      encabezado: "Descarga",
      render: row =>
        row?.FCTM_document_url ? (
          <a href={hostAPI + row.FCTM_document_url} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-download"></i>
          </a>
        ) : "No disponible"
    },
    {
      key: "FCTM_inserted_date",
      encabezado: "Fecha",
      render: row => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)
    },
  ];

  const fetchAction = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/actions/${id}`);

    if (res.success) {
      const normalized = normalizeFromApi(res.data, normalizationConfig);
      setData(normalized);
      setOriginalData(normalized);
    } else {
      showAlert(res.message || "Error al cargar la acción", "error");
      navigate(-1);
    }
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => { fetchAction(); }, [fetchAction]);

  const handleSave = async () => {
    const payload = normalizeToApi(data, normalizationConfig);
    delete payload.FCTM_documents;

    const res = await sendRequest("PATCH", payload, `/actions/${id}`);

    if (res.success) {
      const updated = normalizeFromApi(res.data, normalizationConfig);
      setData(updated);
      setOriginalData(updated);
      setIsEditing(false);
      showAlert("Acción actualizada correctamente", "success");
    } else {
      showAlert(res.message, "error");
    }
  };

  if (loading) return <p className="p-4 text-center">Cargando...</p>;
  if (!data) return null;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Detalle de Acción: ${data.FCTM_action_title || ""}`}
        onBack={() => navigate(-1)}
      />

      <ShowEditableForm
        formTitle="Datos de la Acción"
        formId="actionForm"
        data={data}
        fields={ACTION_FIELDS}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => { setData(originalData); setIsEditing(false); }}
        onChange={(field, value) => setData(prev => ({ ...prev, [field]: value }))}
      />

      <ListCRUD title="Documentos" datos={data.FCTM_documents || []} columnas={columnasDocuments} />
    </section>
  );
};

export default ShowAction;
