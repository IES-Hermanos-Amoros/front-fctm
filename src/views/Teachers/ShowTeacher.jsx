import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  normalizeFromApi,
  normalizeToApi,
  pickFCTMFields
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";
import useCategoryStore from "../../store/categoryStore";

const SAO_FIELDS = [
  { key: "SAO_username", label: "NIF", type: "text" },
  { key: "SAO_registryDate", label: "Fecha de Registro", type: "date" },
  { key: "SAO_accessDate", label: "Ultimo Acceso", type: "date" },
  { key: "SAO_name", label: "Nombre Completo", type: "text" },
  { key: "SAO_organization", label: "Organizacion / Centro", type: "text" },
  { key: "SAO_group", label: "Grupo / Clase", type: "text" },
  { key: "SAO_email", label: "Correo Electronico", type: "email" },
  { key: "SAO_phone", label: "Telefono de Contacto", type: "text" }
];

const buildNormalizationConfig = (categories) => [
  {
    field: "FCTM_company_category",
    options: categories,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  },
  { field: "SAO_registryDate", type: "date" },
  { field: "SAO_accessDate", type: "date" }
];

const ShowTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = useCategoryStore((state) => state.categories);
  const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const FCTM_FIELDS = useMemo(
    () => [
      { key: "FCTM_contact_email", label: "Email de Contacto", type: "email" },
      {
        key: "FCTM_teacher_observations",
        label: "Observaciones",
        type: "textarea"
      },
      { key: "FCTM_teacher_other_contact", label: "Otro contacto", type: "text" },
      {
        key: "FCTM_company_category",
        label: "Categorias",
        type: "select-multi",
        options: categories,
        optionValue: "_id",
        optionLabel: "FCTM_category_name"
      }
    ],
    [categories]
  );

  const normalizationConfig = useMemo(
    () => buildNormalizationConfig(categories),
    [categories]
  );

  const fetchTeacher = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    await cargarCategorias();

    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const res = await sendRequest("GET", null, `/teachers/${id}`);

    if (res.success) {
      const dataNormalizada = normalizeFromApi(res.data, currentNormalization);
      setData(dataNormalizada);
      setOriginalData(dataNormalizada);
      setAvatarUrl(res.data?.FCTM_documents[0]?.FCTM_document_url || "");
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id, cargarCategorias]);

  const handleSave = async () => {
    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const fctmOnly = pickFCTMFields(data);
    const payloadNormalizado = normalizeToApi(fctmOnly, currentNormalization);
    const res = await sendRequest("PATCH", payloadNormalizado, `/teachers/${id}`);

    if (res.success) {
      const dataFinal = normalizeFromApi(res.data, currentNormalization);
      setData(dataFinal);
      setOriginalData(dataFinal);
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
    fetchTeacher();
  }, [fetchTeacher]);

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

      <UserAvatarUploader
        userId={id}
        avatarUrl={avatarUrl}
        onUploadSuccess={fetchTeacher}
      />

      <ShowEditableForm
        formTitle="Informacion de SAO"
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
    </section>
  );
};

export default ShowTeacher;
