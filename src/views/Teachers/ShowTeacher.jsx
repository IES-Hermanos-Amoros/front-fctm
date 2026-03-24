import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, normalizeFromApi, normalizeToApi, pickFCTMFields } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

const categoryOptions = [
  { _id: "69a82074499df1aec1d2477e", FCTM_category_name: "AGRO-JARDINERIA Y COMPOSICIONES FLORALES" },
  { _id: "69a82074499df1aec1d2477f", FCTM_category_name: "DESARROLLO DE APLICACIONES WEB" },
  { _id: "69a82074499df1aec1d24780", FCTM_category_name: "EDUCACIÓN INFANTIL" },
  { _id: "69a82074499df1aec1d24781", FCTM_category_name: "GESTIÓN FORESTAL Y DEL MEDIO NATURAL" },
  { _id: "69a82074499df1aec1d24782", FCTM_category_name: "INTEGRACIÓN SOCIAL" },
  { _id: "69a82074499df1aec1d24783", FCTM_category_name: "PRODUCCIÓN AGROECOLÓGICA" },
  { _id: "69a82074499df1aec1d24784", FCTM_category_name: "SISTEMAS MICROINFORMÁTICOS Y REDES" }
];

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
  {
    key: "FCTM_company_category",
    label: "Categorías",
    type: "select-multi",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name"
  }
];

const normalizationConfig = [
  {
    field: "FCTM_company_category",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  },
  { field: "SAO_registryDate", type: "date" },
  { field: "SAO_accessDate", type: "date" }
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
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id]);

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