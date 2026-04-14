import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  sendRequest, 
  showAlert, 
  normalizeFromApi, 
  normalizeToApi, 
  pickFCTMFields, 
  getBackendHost, 
  validateStrongPassword 
} from "../../utils/functions";

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
  { key: "SAO_phone", label: "Teléfono de Contacto", type: "text" },
];

const FCTM_FIELDS = [
  { key: "FCTM_contact_email", label: "Email de Contacto", type: "email" },
  { key: "FCTM_teacher_observations", label: "Observaciones", type: "textarea" },
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

const ShowTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");


  const [pwdDataParaEnviar, setPwdDataParaEnviar] = useState(null);

  const fetchTeacher = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await sendRequest("GET", null, `/teachers/${id}`);

    if (res.success) {
      const dataNormalizada = normalizeFromApi(res.data, normalizationConfig);
      setData(dataNormalizada);
      setOriginalData(dataNormalizada);
      setAvatarUrl(res.data?.FCTM_documents[0]?.FCTM_document_url || "");
    } else {
      showAlert(res.message, "error");
    }
    setLoading(false);
  }, [id]);

  const handleSave = async () => {

    if (pwdDataParaEnviar) {
      const { password, newPassword, repeatPassword } = pwdDataParaEnviar;

      if (!password || !newPassword || !repeatPassword) {
        return showAlert("Debes rellenar todos los campos de contraseña", "error");
      }
      if (newPassword !== repeatPassword) {
        return showAlert("La nueva contraseña y su repetición no coinciden", "error");
      }
      if (!validateStrongPassword(newPassword)) {
        return showAlert("La nueva contraseña no cumple los requisitos de seguridad", "error");
      }
    }


    const fctmOnly = pickFCTMFields(data);
    const payloadNormalizado = normalizeToApi(fctmOnly, normalizationConfig);


    if (pwdDataParaEnviar) {
      payloadNormalizado.password = pwdDataParaEnviar.password;
      payloadNormalizado.newPassword = pwdDataParaEnviar.newPassword;
    }

    const res = await sendRequest("PATCH", payloadNormalizado, `/teachers/${id}`);

    if (res.success) {
      const dataFinal = normalizeFromApi(res.data, normalizationConfig);
      setData(dataFinal);
      setOriginalData(dataFinal);
      setIsEditing(false);
      setPwdDataParaEnviar(null);
      showAlert("Perfil de profesor actualizado correctamente", "success");
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
    setPwdDataParaEnviar(null);
  };

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  if (loading) return <p className="p-4 text-center">Cargando datos...</p>;
  if (!id) return <p className="p-4 text-center">Falta el id del profesor en la URL.</p>;
  if (!data) return <p className="p-4 text-center">No se encontraron datos del profesor.</p>;

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

      <SectionChangePassword 
        isEditing={isEditing} 
        onChange={(newData) => setPwdDataParaEnviar(newData)} 
      />
    </section>
  );
};

export default ShowTeacher;