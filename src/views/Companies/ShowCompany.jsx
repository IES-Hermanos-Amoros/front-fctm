import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert, confirmation, normalizeFromApi, normalizeToApi, pickFCTMFields, formatDateDDMMYYYY,getBackendHost, ensureSkills } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";


//TEMPORAL - PENDIENTE DE ZUSTAND Y MAESTROS EN API
// Ejemplo de categorías para el multiselect
const categoryOptions = [
  {
    _id: "69a82074499df1aec1d2477e",
    FCTM_category_name: "AGRO-JARDINERIA Y COMPOSICIONES FLORALES"
  },
  {
    _id: "69a82074499df1aec1d2477f",
    FCTM_category_name: "DESARROLLO DE APLICACIONES WEB"
  },
  {
    _id: "69a82074499df1aec1d24780",
    FCTM_category_name: "EDUCACIÓN INFANTIL"
  },
  {
    _id: "69a82074499df1aec1d24781",
    FCTM_category_name: "GESTIÓN FORESTAL Y DEL MEDIO NATURAL"
  },
  {
    _id: "69a82074499df1aec1d24782",
    FCTM_category_name: "INTEGRACIÓN SOCIAL"
  },
  {
    _id: "69a82074499df1aec1d24783",
    FCTM_category_name: "PRODUCCIÓN AGROECOLÓGICA"
  },
  {
    _id: "69a82074499df1aec1d24784",
    FCTM_category_name: "SISTEMAS MICROINFORMÁTICOS Y REDES"
  }
];

const normalizationConfigFactory = (skillOpts) => [
  {
    field: "FCTM_company_category",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  },
  {
    field: "FCTM_skills",
    options: skillOpts,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name",
    type: "multi"
  }
];

const camposSAO = [
  { key: "SAO_id", label: "ID Interno SAO" },
  { key: "SAO_username", label: "CIF" },
  { key: "SAO_registryDate", label: "Fecha de Registro" },
  { key: "SAO_accessDate", label: "Último Acceso" },
  { key: "SAO_name", label: "Nombre / Razón Social" },
  { key: "SAO_organization", label: "Organización / Centro" },
  { key: "SAO_group", label: "Grupo / Curso" },
  { key: "SAO_email", label: "E-mail" },
  { key: "SAO_phone", label: "Teléfono de Contacto" },
  { key: "SAO_company_FCT_Number", label: "Nº Convenio FE" },
  { key: "SAO_company_FCT_Date", label: "Fecha Convenio FE" },
  { key: "SAO_company_FPDual_Number", label: "Nº Convenio FE Intensiva" },
  { key: "SAO_company_FPDual_Date", label: "Fecha Convenio FE Intensiva" },
  { key: "SAO_company_city", label: "Localidad" },
  { key: "SAO_company_state", label: "Provincia" },
  { key: "SAO_company_address", label: "Dirección Social" },
  { key: "SAO_company_activity", label: "Actividad Económica" },
  { key: "SAO_company_nameManager", label: "Nombre del Representante / Gerente" },
  { key: "SAO_company_idManager", label: "DNI/NIE del Representante" },
  { key: "SAO_company_deedDate", label: "Fecha de Escritura" }
];

const camposFCTMFactory = (skillOpts) => [
  {
    key: "FCTM_company_category",
    label: "Familias Profesionales",
    type: "select-multi",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name"
  },
  {
    key: "FCTM_skills",
    label: "Aptitudes/Tecnologías",
    type: "select-multi-creatable", 
    options: skillOpts,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  },
  { 
    key: "FCTM_company_openToHire", 
    label: "Interesada en contratar", 
    type: "select", 
    options: [
      { _id: true, nombre: "Sí" },
      { _id: false, nombre: "No" }
    ]
  },
  { key: "FCTM_company_other_contact", label: "Otro contacto", type: "text" },
  { key: "FCTM_company_observations", label: "Observaciones", type: "textarea" },
];



const ShowCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const hostAPI = getBackendHost()

  const [skillOptions, setSkillOptions] = useState([]);
  
  const normalizationConfig = useMemo(() => normalizationConfigFactory(skillOptions), [skillOptions]);
  const camposFCTM = useMemo(() => camposFCTMFactory(skillOptions), [skillOptions]);

  const fetchCompany = useCallback(async () => {
    setLoading(true);

    const [resSkills, resCompany] = await Promise.all([
      sendRequest("GET", null, "/skills"),
      sendRequest("GET", null, `/companies/${id}`)
    ]);

    let loadedSkills = [];
    if (resSkills.success) {
      loadedSkills = resSkills.data;
      setSkillOptions(loadedSkills);
    }

    if (resCompany.success) {
      const currentNormConfig = normalizationConfigFactory(loadedSkills);
      const normalized = normalizeFromApi(resCompany.data, currentNormConfig);
      
      setData(normalized);
      setOriginalData(normalized);
      setAvatarUrl(resCompany.data?.FCTM_documents[0]?.FCTM_document_url || "");
    } else {
      showAlert("Error al cargar la empresa", "error");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleDeleteJobOffer = useCallback(async (jobOfferId) => {
    const confirmed = await confirmation("¿Seguro que quieres eliminar esta oferta de trabajo?");
    if (!confirmed) return;

    const res = await sendRequest(
      "DELETE",
      undefined,
      `/joboffers/${jobOfferId}?companyId=${encodeURIComponent(id)}`
    );

    if (res.success) {
      await fetchCompany();
    } else {
      showAlert(res.message || "Error al eliminar oferta", "error");
    }
  }, [id, fetchCompany]);

  const columnasOfertas = useMemo(() => ([
    { key: "FCTM_job_title", encabezado: "Título" },
    {
      key: "FCTM_job_start_date",
      encabezado: "Fec. Ini",
      render: (row) => formatDateDDMMYYYY(row.FCTM_job_start_date)
    },
    {
      key: "FCTM_job_end_date",
      encabezado: "Fec. Fin",
      render: (row) => formatDateDDMMYYYY(row.FCTM_job_end_date)
    },
    { key: "FCTM_job_status", encabezado: "Estado" },
    {
      key: "__show",
      encabezado: "Ver",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate(`/joboffers/${row._id}`, { state: { companyId: id } })}
          title="Ver oferta"
        >
          <i className="bi bi-search"></i>
        </button>
      )
    },
    {
      key: "__delete",
      encabezado: "Eliminar",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteJobOffer(row._id)}
          title="Eliminar oferta"
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ]), [navigate, id, handleDeleteJobOffer]);

  const handleSave = async () => {
    try {
      // Create any missing skills and get array of _id's
      const skillIds = await ensureSkills(data.FCTM_skills);

      // 1. Solo campos FCTM_
      const fctmOnly = pickFCTMFields(data);

      // 2. Normalizamos selects
      const payloadNormalizado = normalizeToApi(fctmOnly, normalizationConfig);

      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds
      };

      console.log(finalPayload)
      const res = await sendRequest("PATCH", finalPayload, `/companies/${id}`);
      
      if (res.success) {
        const normalized = normalizeFromApi(res.data, normalizationConfig);
        //showAlert("Empresa actualizada con éxito", "success");
        setData(normalized);
        setOriginalData(normalized);
        setIsEditing(false);
        // RECARGAMOS para recuperar el populate de las ofertas y que no desaparezcan de la tabla
        //fetchCompany(); 
      } else {
        showAlert(res.message || "Error al guardar los cambios", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error crítico", "error");
    }
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  if (loading) return <p>Cargando información...</p>;
  if (!data) return <p>Empresa no encontrada.</p>;

  return (
    <section>
      <ShowHeader
        title={`Ficha de ${data?.SAO_name || 'Empresa'}`}
        onBack={() => navigate('/companies')}
      />

      <UserAvatarUploader
        userId={id}
        avatarUrl={avatarUrl}
        onUploadSuccess={fetchCompany}
      />

      <div className="mb-4">
        <h3>Información SAO</h3>
        <ShowEditableForm
          formTitle="Datos de SAO"
          formId="saoForm"
          data={data}
          fields={camposSAO}
          hideEditButton={true}
        />
      </div>

      <hr />

      <div className="mb-4">
        <h3>Datos Adicionales FCTM</h3>
        <ShowEditableForm
          formTitle="Gestión de Datos FCTM"
          formId="fctmForm"
          data={data}
          fields={camposFCTM}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleChange}
        />
      </div>

      <hr />

      <ListCRUD
        title="Ofertas de Trabajo Relacionadas"
        datos={data.FCTM_job_offers || []}
        columnas={columnasOfertas}
      >
        <button
          className="btn btn-primary"
          onClick={() => navigate('/joboffers/new', { state: { companyId: id } })}
        >
          Nueva Oferta de Trabajo
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowCompany;
