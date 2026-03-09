import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

const SAO_FIELDS = [
  { key: "SAO_username", label: "NIF", type: "text" },
  { key: "SAO_registryDate", label: "Fecha de Registro", type: "date" },
  { key: "SAO_accessDate", label: "Último Acceso", type: "date" },
  { key: "SAO_name", label: "Nombre Completo", type: "text" },
  { key: "SAO_organization", label: "Organización / Centro", type: "text" },
  { key: "SAO_group", label: "Grupo / Clase", type: "text" },
  { key: "SAO_email", label: "Correo Electrónico", type: "email" },
  { key: "SAO_phone", label: "Teléfono de Contacto", type: "text" }
];

const FCTM_FIELDS = [
  { key: "FCTM_contact_email", label: "Email de Contacto", type: "email" }
];

const toInputDate = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  return value.includes("T") ? value.split("T")[0] : value;
};

const ShowAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const fetchAdmin = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await sendRequest("GET", null, `/administrators/${id}`);

    if (res.success) {
      const normalized = {
        ...res.data,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate)
      };

      setData(normalized);
      setOriginalData(normalized);
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    const payload = {
      FCTM_contact_email: data?.FCTM_contact_email || null
    };

    const res = await sendRequest("PATCH", payload, `/administrators/${id}`);

    if (res.success) {
      const normalized = {
        ...res.data,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate)
      };

      setData(normalized);
      setOriginalData(normalized);
      setIsEditing(false);
    } else {
      showAlert(res.message, "error");
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  if (loading) return <p>Cargando datos...</p>;
  if (!id) return <p>Falta el id del administrador en la URL.</p>;
  if (!data) return <p>No se encontraron datos del administrador.</p>;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Perfil de ${data?.SAO_name || "Administrador"}`}
        onBack={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }}
      />

      <ShowEditableForm
        formTitle="Información de SAO"
        formId="adminSaoForm"
        data={data}
        fields={SAO_FIELDS}
        hideEditButton={true}
      />

      <ShowEditableForm
        formTitle="Datos Adicionales"
        formId="adminFctmForm"
        data={data}
        fields={FCTM_FIELDS}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />
    </section>
  );
};

export default ShowAdmin;
