import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, normalizeFromApi, normalizeToApi, pickFCTMFields, getBackendHost } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";

import useCategoryStore from "../../store/categoryStore";


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
  // ✅ 1. Asegurar options siempre válidas
  const safeCategories = useMemo(() => categories || [], [categories]);

  const FCTM_FIELDS = useMemo(() =>[
    { key: "FCTM_contact_email", label: "Email de Contacto", type: "email" },
    {
      key: "FCTM_teacher_observations",
      label: "Observaciones",
      type: "textarea",
    },
    { key: "FCTM_teacher_other_contact", label: "Otro contacto", type: "text" },
    {
      key: "FCTM_company_category",
      label: "Categorías",
      type: "select-multi",
      options: safeCategories,
      optionValue: "_id",
      optionLabel: "FCTM_category_name"
    }
  ], [safeCategories]);

  const normalizationConfig = useMemo(() => [
    {
      field: "FCTM_company_category",
      options: safeCategories,
      optionValue: "_id",
      optionLabel: "FCTM_category_name",
      type: "multi"
    },
    { field: "SAO_registryDate", type: "date" },
    { field: "SAO_accessDate", type: "date" }
  ], [safeCategories]);

  const fetchTeacher = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await sendRequest("GET", null, `/teachers/${id}`);

    if (res.success) {
      /*const normalized = {
        ...res.data,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate),
      };*/

      //const configSoloCategorias = normalizationConfig.filter(c => c.field === "FCTM_category");
      const dataNormalizada = normalizeFromApi(res.data, normalizationConfig);
      console.log(dataNormalizada)

      setData(dataNormalizada);
      setOriginalData(dataNormalizada);
      setAvatarUrl(res.data?.FCTM_documents[0]?.FCTM_document_url || "");
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id, normalizationConfig]);

  const handleSave = async () => {
    /*const payload = {
      FCTM_contact_email: data?.FCTM_contact_email || null,
      FCTM_teacher_observations: data?.FCTM_teacher_observations || null,
      FCTM_teacher_other_contact: data?.FCTM_teacher_other_contact || null,
    };*/

    const fctmOnly = pickFCTMFields(data);
    const payloadNormalizado = normalizeToApi(fctmOnly, normalizationConfig);
    const res = await sendRequest("PATCH", payloadNormalizado, `/teachers/${id}`);

    if (res.success) {
      /*const normalized = {
        ...res.data,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate),
      };*/

      const dataFinal = normalizeFromApi(res.data, normalizationConfig);
      console.log(dataFinal)
      
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
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  // ✅ 3. Cargar categorías + teacher en orden correcto
  useEffect(() => {
    const init = async () => {
      await cargarCategorias();
    };
    init();
  }, [cargarCategorias]);

  useEffect(() => {
    if (categories?.length > 0) {
      fetchTeacher();
    }
  }, [categories, fetchTeacher]);

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
    </section>
  );
};

export default ShowTeacher;