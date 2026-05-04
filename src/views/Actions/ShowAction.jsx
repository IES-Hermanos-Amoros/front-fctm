import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  sendRequest, 
  showAlert, 
  normalizeFromApi, 
  normalizeToApi 
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

// --- CONFIGURACIÓN DE CAMPOS SEGÚN TU MODELO ---
const ACTION_FIELDS = [
  { key: "FCTM_action_title", label: "Título de la Acción", type: "text" }, // Obligatorio en backend
  { key: "FCTM_action_datetime", label: "Fecha y Hora", type: "date" },    // datetime en backend
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
  { key: "FCTM_action_notes", label: "Notas / Observaciones", type: "textarea" }, // notes en backend
];

const normalizationConfig = [
  { field: "FCTM_action_datetime", type: "date" }
];

const ShowAction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const fetchAction = useCallback(async () => {
    setLoading(true);
    // Tu controlador usa getActionById -> /api/v2/actions/:id
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
    
    // Eliminamos documentos para no enviarlos (el backend los gestiona aparte en el create, no en update)
    delete payload.FCTM_documents;

    // Tu controlador usa editActionById -> PATCH /api/v2/actions/:id
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

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12 col-lg-8">
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
          </div>

          <div className="col-12 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Documentos Adjuntos</h5>
              </div>
              <div className="card-body">
                <p className="small text-muted mb-3 italic">
                  Para modificar documentos, elimine la acción y cree una nueva.
                </p>
                {data.FCTM_documents?.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {data.FCTM_documents.map((doc, index) => (
                      <a key={index} href={doc.FCTM_document_url} target="_blank" rel="noreferrer" className="list-group-item list-group-item-action">
                        <i className="bi bi-file-earmark-text me-2"></i>
                        {doc.FCTM_document_name || `Archivo ${index + 1}`}
                      </a>
                    ))}
                  </div>
                ) : <p className="text-muted">No hay documentos adjuntos.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowAction;