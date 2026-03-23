import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, normalizeFromApi, normalizeToApi } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

const CATEGORY_FIELDS_CONFIG = {
  field: "FCTM_company_category",
  optionValue: "_id",
  optionLabel: "FCTM_category_name",
  type: "multi"
};

const CATEGORY_FIELD = {
  key: "FCTM_company_category",
  label: "Familias Profesionales",
  type: "select-multi",
  optionValue: "_id",
  optionLabel: "FCTM_category_name",
  options: []
};

const SAO_FIELDS = [
  { key: "SAO_username", label: "NIF", type: "text" },
  { key: "SAO_registryDate", label: "Fecha de Registro", type: "date" },
  { key: "SAO_accessDate", label: "Último Acceso", type: "date" },
  { key: "SAO_name", label: "Nombre Completo", type: "text" },
  { key: "SAO_organization", label: "Organización / Centro", type: "text" },
  { key: "SAO_group", label: "Grupo / Clase", type: "text" },
  { key: "SAO_email", label: "Correo Electrónico", type: "email" },
  { key: "SAO_phone", label: "Teléfono de Contacto", type: "text" },
];

const FCTM_FIELDS = [
  { key: "FCTM_contact_email", label: "Email de Contacto", type: "email" },
  {
    key: "FCTM_teacher_observations",
    label: "Observaciones",
    type: "textarea",
  },
  { key: "FCTM_teacher_other_contact", label: "Otro contacto", type: "text" },
];

const toInputDate = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  return value.includes("T") ? value.split("T")[0] : value;
};

const ShowTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const fetchTeacher = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await sendRequest("GET", null, `/teachers/${id}`);

    if (res.success) {
      const normalized = normalizeFromApi(res.data, [CATEGORY_FIELDS_CONFIG]);
      const dataNormalized = {
        ...normalized,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate),
      };

      setData(dataNormalized);
      setOriginalData(dataNormalized);
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id]);

  const fetchCategories = useCallback(async () => {
    const res = await sendRequest("GET", null, "/categories");
    if (res.success) {
      setCategoryOptions(res.data);
      CATEGORY_FIELD.options = res.data;
    }
  }, []);

  const handleSave = async () => {
    const configSinSkills = [CATEGORY_FIELDS_CONFIG];
    const payloadNormalizado = normalizeToApi(data, configSinSkills);

    const payload = {
      FCTM_contact_email: data?.FCTM_contact_email || null,
      FCTM_teacher_observations: data?.FCTM_teacher_observations || null,
      FCTM_teacher_other_contact: data?.FCTM_teacher_other_contact || null,
      ...payloadNormalizado
    };

    const res = await sendRequest("PATCH", payload, `/teachers/${id}`);

    if (res.success) {
      const normalized = normalizeFromApi(res.data, [CATEGORY_FIELDS_CONFIG]);
      const dataNormalized = {
        ...normalized,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate),
      };

      setData(dataNormalized);
      setOriginalData(dataNormalized);
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

  useEffect(() => {
    fetchTeacher();
    fetchCategories();
  }, [fetchTeacher, fetchCategories]);

  if (loading) return <p>Cargando datos...</p>;
  if (!id) return <p>Falta el id del profesor en la URL.</p>;
  if (!data) return <p>No se encontraron datos del profesor.</p>;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Perfil de ${data?.SAO_name || "Profesor"}`}
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
        formId="teacherSaoForm"
        data={data}
        fields={SAO_FIELDS}
        hideEditButton={true}
      />

      <ShowEditableForm
        formTitle="Datos Adicionales"
        formId="teacherFctmForm"
        data={data}
        fields={FCTM_FIELDS}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      <ShowEditableForm
        formTitle="Familias Profesionales"
        formId="teacherCategoriesForm"
        data={data}
        fields={[CATEGORY_FIELD]}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />
    </section>
  );
};

export default ShowTeacher;
