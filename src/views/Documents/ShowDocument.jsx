import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, getBackendHost } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

// --- CONSTANTES ---
// Espejo del enum DOCUMENT_TYPE (back-fctm/models/enum.js)
const documentTypes = [
  { _id: "GENERAL", nombre: "GENERAL" },
  { _id: "MANUAL", nombre: "MANUAL" },
  { _id: "DECRETO/ORDEN/CURRÍCULUM", nombre: "DECRETO/ORDEN/CURRÍCULUM" },
  { _id: "CURRÍCULUM VITAE", nombre: "CURRÍCULUM VITAE" },
  { _id: "OTRO", nombre: "OTRO" },
  { _id: "AVATAR", nombre: "AVATAR" }
];

// Espejo del enum USER_PROFILES (back-fctm/models/enum.js)
const profileOptions = [
  { _id: "ADMINISTRADOR", nombre: "ADMINISTRADOR" },
  { _id: "PROFESOR", nombre: "PROFESOR" },
  { _id: "ALUMNO", nombre: "ALUMNO" },
  { _id: "EMPRESA", nombre: "EMPRESA" }
];

// Campos editables — Alejandro permite modificar (S7-085 Edit).
// El archivo adjunto (FCTM_document_url) y la relación con oferta/alumno
// NO se pueden modificar (requisito issue #145).
const editableFields = [
  { key: "FCTM_document_name", label: "Nombre", type: "text", required: true },
  { key: "FCTM_document_description", label: "Descripción", type: "textarea" },
  {
    key: "FCTM_document_type",
    label: "Tipo",
    type: "select",
    options: documentTypes,
    optionValue: "_id",
    optionLabel: "nombre",
    required: true
  },
  {
    key: "FCTM_visible_to_profiles",
    label: "Perfiles que pueden ver el documento",
    type: "select-multi",
    options: profileOptions,
    optionValue: "_id",
    optionLabel: "nombre"
  }
];

// Campos read-only — nunca editables (archivo adjunto, autor, fechas, relaciones).
const readOnlyFields = [
  { key: "_id", label: "ID", type: "text" },
  { key: "FCTM_document_url", label: "Ruta del archivo", type: "text" },
  { key: "FCTM_document_created_by_name", label: "Subido por", type: "text" },
  { key: "FCTM_inserted_date_fmt", label: "Fecha de subida", type: "text" },
  { key: "FCTM_updated_date_fmt", label: "Última actualización", type: "text" },
  { key: "oferta_relacionada_titulo", label: "Oferta relacionada", type: "text" }
];

// Normaliza la respuesta del back para que ShowEditableForm pueda pintar
// los campos de tipo select-multi (espera array de objetos con value/label).
const normalizeFromApi = (raw) => {
  const visible = Array.isArray(raw.FCTM_visible_to_profiles)
    ? raw.FCTM_visible_to_profiles.map((p) =>
        typeof p === "string" ? { value: p, label: p } : p
      )
    : [];

  return {
    ...raw,
    FCTM_visible_to_profiles: visible,
    FCTM_document_created_by_name:
      raw.FCTM_document_created_by?.SAO_name || "—",
    FCTM_inserted_date_fmt: raw.FCTM_inserted_date
      ? new Date(raw.FCTM_inserted_date).toLocaleString()
      : "—",
    FCTM_updated_date_fmt: raw.FCTM_updated_date
      ? new Date(raw.FCTM_updated_date).toLocaleString()
      : "—",
    oferta_relacionada_titulo:
      raw.oferta_relacionada?.[0]?.FCTM_job_title || "—"
  };
};

// Devuelve un payload limpio listo para PATCH /documents/:id.
// react-select devuelve {value,label}; el back espera array de strings.
const normalizeToApi = (data) => {
  const visible = Array.isArray(data.FCTM_visible_to_profiles)
    ? data.FCTM_visible_to_profiles
        .map((p) => p?.value || p?._id || p)
        .filter(Boolean)
    : [];

  return {
    FCTM_document_name: data.FCTM_document_name,
    FCTM_document_description: data.FCTM_document_description || "",
    FCTM_document_type: data.FCTM_document_type,
    FCTM_visible_to_profiles: visible
  };
};

const ShowDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- CARGA ---
  const fetchDocument = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await sendRequest("GET", null, `/documents/${id}`);
    if (res.success) {
      const normalized = normalizeFromApi(res.data);
      setData(normalized);
      setOriginalData(normalized);
    } else {
      setError(res.message || "No se pudo cargar el documento");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // --- HANDLERS DE EDICIÓN ---
  const handleEdit = () => setIsEditing(true);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  // ────────────────────────────────────────────────────────────────────────
  // HANDOVER ALEJANDRO — Issue #145 (S7-085 Edit Documents)
  //
  // Esta función ya está cableada con un PATCH funcional contra
  // /documents/:id. Lo que tienes que pulir tú:
  //
  //   1. Validación de campos antes de enviar (nombre no vacío, tipo válido).
  //   2. Mensajes de error específicos del back: 403 → "No tienes permiso
  //      para editar este documento", 404 → "Documento ya no existe",
  //      500 → mensaje genérico.
  //   3. Si el back devuelve campos extra (acciones_relacionadas, etc.),
  //      conserva data o llama de nuevo a fetchDocument() para refrescar.
  //   4. (Opcional) Confirmar con el usuario antes de guardar si cambia
  //      FCTM_visible_to_profiles (afecta a quién puede leer el documento).
  //
  // Endpoint correcto: PATCH (no PUT) según back-fctm/routes/document.routes.js.
  // ────────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const payload = normalizeToApi(data);
      const res = await sendRequest("PATCH", payload, `/documents/${id}`);

      if (!res.success) {
        showAlert(res.message || "Error al actualizar el documento", "error");
        return;
      }

      const normalized = normalizeFromApi(res.data);
      setData(normalized);
      setOriginalData(normalized);
      setIsEditing(false);
      showAlert("Documento actualizado correctamente", "success");
    } catch (err) {
      console.error(err);
      showAlert("Error crítico al guardar", "error");
    }
  };

  // --- RENDER ---
  if (loading) {
    return <p className="p-5 text-center">Cargando...</p>;
  }

  if (error || !data) {
    return (
      <section className="dashboard section">
        <div className="alert alert-danger">
          {error || "Documento no encontrado"}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </section>
    );
  }

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Ficha del documento: ${data.FCTM_document_name || ""}`}
        onBack={() => navigate("/documents")}
      />

      <ShowEditableForm
        formTitle="Datos del documento"
        formId="documentForm"
        data={data}
        fields={editableFields}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      <ShowEditableForm
        formTitle="Información del archivo (no editable)"
        formId="documentReadOnlyForm"
        data={data}
        fields={readOnlyFields}
        hideEditButton={true}
      />

      <div className="card mt-3">
        <div className="card-body">
          <a
            href={getBackendHost() + data.FCTM_document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
          >
            Ver/Descargar archivo
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShowDocument;
