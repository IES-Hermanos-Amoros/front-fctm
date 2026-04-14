import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, normalizeFromApi, normalizeToApi, pickFCTMFields, validateStrongPassword } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";
import SectionChangePassword from "../../components/User/SectionChangePassword";


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
  { key: "SAO_phone", label: "Teléfono de Contacto", type: "text" }
];

const FCTM_FIELDS = [
  { key: "FCTM_contact_email", label: "Email de Contacto", type: "email" },
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


const ShowAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [passwordData, setPasswordData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const fetchAdmin = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await sendRequest("GET", null, `/administrators/${id}`);

    if (res.success) {
      /*const normalized = {
        ...res.data,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate)
      };*/

      const normalized = normalizeFromApi(res.data, normalizationConfig);
      
      setData(normalized);
      setOriginalData(normalized);
      setAvatarUrl(res.data?.FCTM_documents[0]?.FCTM_document_url || "");

    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    /*const payload = {
      FCTM_contact_email: data?.FCTM_contact_email || null
    };*/
    const fctmOnly = pickFCTMFields(data);
    const payload = normalizeToApi(fctmOnly, normalizationConfig);

    const isChangingPassword = !!passwordData;

    if (isChangingPassword) {
      const currentPassword = passwordData.password?.trim() || "";
      const newPassword = passwordData.newPassword?.trim() || "";
      const repeatPassword = passwordData.repeatPassword?.trim() || "";

      if (!currentPassword || !newPassword || !repeatPassword) {
        showAlert("Para cambiar la contraseña, debe rellenar los 3 campos", "error");
        return;
      }

      if (!validateStrongPassword(newPassword)) {
        showAlert(
          "La nueva contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial",
          "error"
        );
        return;
      }

      if (newPassword !== repeatPassword) {
        showAlert("La nueva contraseña y su repetición no coinciden", "error");
        return;
      }

      payload.password = currentPassword;
      payload.newPassword = newPassword;
    }

    console.log("Payload a enviar:", payload);
    const res = await sendRequest("PATCH", payload, `/administrators/${id}`);

    if (res.success) {
      /*const normalized = {
        ...res.data,
        SAO_registryDate: toInputDate(res.data?.SAO_registryDate),
        SAO_accessDate: toInputDate(res.data?.SAO_accessDate)
      };*/
      const normalized = normalizeFromApi(res.data, normalizationConfig);

      setData(normalized);
      setOriginalData(normalized);
      setPasswordData(null);
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
    setPasswordData(null);
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

      <UserAvatarUploader
        userId={id}
        avatarUrl={avatarUrl}
        onUploadSuccess={fetchAdmin}
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

      <SectionChangePassword
        isEditing={isEditing}
        onChange={setPasswordData}
      />
    </section>
  );
};

export default ShowAdmin;
