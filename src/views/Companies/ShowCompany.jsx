import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  confirmation,
  normalizeFromApi,
  normalizeToApi,
  pickFCTMFields,
  formatDateDDMMYYYY
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";
import useCategoryStore from "../../store/categoryStore";

const skillOptions = [
  { _id: "69bd6bb2e1aa8f195c71c305", FCTM_skill_name: "ADAPTABILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c31d", FCTM_skill_name: "ADMINISTRACION DE SISTEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c339", FCTM_skill_name: "ADOBE ILLUSTRATOR" },
  { _id: "69bd6bb2e1aa8f195c71c338", FCTM_skill_name: "ADOBE PHOTOSHOP" },
  { _id: "69bd6bb2e1aa8f195c71c341", FCTM_skill_name: "AGRICULTURA ECOLOGICA" },
  { _id: "69bd6bb2e1aa8f195c71c320", FCTM_skill_name: "ANGULAR" },
  { _id: "69bd6bb2e1aa8f195c71c32b", FCTM_skill_name: "ANALISIS DE DATOS" },
  { _id: "69bd6bb2e1aa8f195c71c32e", FCTM_skill_name: "ATENCION AL CLIENTE" },
  { _id: "69bd6bb2e1aa8f195c71c322", FCTM_skill_name: "AWS" },
  { _id: "69bd6bb2e1aa8f195c71c323", FCTM_skill_name: "AZURE" },
  { _id: "69bd6bb2e1aa8f195c71c344", FCTM_skill_name: "BOTANICA" },
  { _id: "69bd6bb2e1aa8f195c71c325", FCTM_skill_name: "C#" },
  { _id: "69bd6bb2e1aa8f195c71c326", FCTM_skill_name: "C++" },
  { _id: "69bd6bb2e1aa8f195c71c316", FCTM_skill_name: "CIBERSEGURIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c315", FCTM_skill_name: "CLOUD COMPUTING" },
  { _id: "69bd6bb2e1aa8f195c71c301", FCTM_skill_name: "COMUNICACION EFECTIVA" },
  { _id: "69bd6bb2e1aa8f195c71c332", FCTM_skill_name: "CONTENT MARKETING" },
  { _id: "69bd6bb2e1aa8f195c71c345", FCTM_skill_name: "CONTROL DE PLAGAS" },
  { _id: "69bd6bb2e1aa8f195c71c308", FCTM_skill_name: "CREATIVIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c310", FCTM_skill_name: "CSS3" },
  { _id: "69bd6bb2e1aa8f195c71c329", FCTM_skill_name: "DESARROLLO DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c30b", FCTM_skill_name: "DESARROLLO WEB" },
  { _id: "69bd6bb2e1aa8f195c71c335", FCTM_skill_name: "DISENO GRAFICO" },
  { _id: "69bd6bb2e1aa8f195c71c33b", FCTM_skill_name: "DOCENCIA" },
  { _id: "69bd6bb2e1aa8f195c71c318", FCTM_skill_name: "DOCKER" },
  { _id: "69bd6bb2e1aa8f195c71c334", FCTM_skill_name: "E-COMMERCE" },
  { _id: "69bd6bb2e1aa8f195c71c33c", FCTM_skill_name: "E-LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c33a", FCTM_skill_name: "EDICION DE VIDEO" },
  { _id: "69bd6bb2e1aa8f195c71c30a", FCTM_skill_name: "EMPATIA" },
  { _id: "69bd6bb2e1aa8f195c71c328", FCTM_skill_name: "ESTRATEGIA DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c337", FCTM_skill_name: "FIGMA" },
  { _id: "69bd6bb2e1aa8f195c71c343", FCTM_skill_name: "GESTION AMBIENTAL" },
  { _id: "69bd6bb2e1aa8f195c71c327", FCTM_skill_name: "GESTION DE PROYECTOS" },
  { _id: "69bd6bb2e1aa8f195c71c303", FCTM_skill_name: "GESTION DEL TIEMPO" },
  { _id: "69bd6bb2e1aa8f195c71c347", FCTM_skill_name: "GESTION FORESTAL" },
  { _id: "69bd6bb2e1aa8f195c71c317", FCTM_skill_name: "GIT" },
  { _id: "69bd6bb2e1aa8f195c71c333", FCTM_skill_name: "GOOGLE ANALYTICS" },
  { _id: "69bd6bb2e1aa8f195c71c309", FCTM_skill_name: "HABLAR EN PUBLICO" },
  { _id: "69bd6bb2e1aa8f195c71c30f", FCTM_skill_name: "HTML5" },
  { _id: "69bd6bb2e1aa8f195c71c33e", FCTM_skill_name: "INTEGRACION SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c31a", FCTM_skill_name: "INTELIGENCIA ARTIFICIAL" },
  { _id: "69bd6bb2e1aa8f195c71c307", FCTM_skill_name: "INTELIGENCIA EMOCIONAL" },
  { _id: "69bd6bb2e1aa8f195c71c33d", FCTM_skill_name: "INTERVENCION SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c348", FCTM_skill_name: "JARDINERIA" },
  { _id: "69bd6bb2e1aa8f195c71c30e", FCTM_skill_name: "JAVA" },
  { _id: "69bd6bb2e1aa8f195c71c30c", FCTM_skill_name: "JAVASCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c319", FCTM_skill_name: "KUBERNETES" },
  { _id: "69bd6bb2e1aa8f195c71c2ff", FCTM_skill_name: "LIDERAZGO" },
  { _id: "69bd6bb2e1aa8f195c71c31b", FCTM_skill_name: "MACHINE LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c32f", FCTM_skill_name: "MARKETING DIGITAL" },
  { _id: "69bd6bb2e1aa8f195c71c306", FCTM_skill_name: "NEGOCIACION" },
  { _id: "69bd6bb2e1aa8f195c71c312", FCTM_skill_name: "NODE.JS" },
  { _id: "69bd6bb2e1aa8f195c71c314", FCTM_skill_name: "NOSQL" },
  { _id: "69bd6bb2e1aa8f195c71c340", FCTM_skill_name: "ORIENTACION LABORAL" },
  { _id: "69bd6bb2e1aa8f195c71c342", FCTM_skill_name: "PAISAJISMO" },
  { _id: "69bd6bb2e1aa8f195c71c304", FCTM_skill_name: "PENSAMIENTO CRITICO" },
  { _id: "69bd6bb2e1aa8f195c71c324", FCTM_skill_name: "PHP" },
  { _id: "69bd6bb2e1aa8f195c71c32a", FCTM_skill_name: "PLANIFICACION ESTRATEGICA" },
  { _id: "69bd6bb2e1aa8f195c71c33f", FCTM_skill_name: "PSICOLOGIA" },
  { _id: "69bd6bb2e1aa8f195c71c30d", FCTM_skill_name: "PYTHON" },
  { _id: "69bd6bb2e1aa8f195c71c311", FCTM_skill_name: "REACT" },
  { _id: "69bd6bb2e1aa8f195c71c32c", FCTM_skill_name: "RECURSOS HUMANOS" },
  { _id: "69bd6bb2e1aa8f195c71c31e", FCTM_skill_name: "REDES DE COMPUTADORES" },
  { _id: "69bd6bb2e1aa8f195c71c302", FCTM_skill_name: "RESOLUCION DE PROBLEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c331", FCTM_skill_name: "SEM" },
  { _id: "69bd6bb2e1aa8f195c71c330", FCTM_skill_name: "SEO" },
  { _id: "69bd6bb2e1aa8f195c71c31c", FCTM_skill_name: "SOPORTE TECNICO" },
  { _id: "69bd6bb2e1aa8f195c71c346", FCTM_skill_name: "SOSTENIBILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c313", FCTM_skill_name: "SQL" },
  { _id: "69bd6bb2e1aa8f195c71c300", FCTM_skill_name: "TRABAJO EN EQUIPO" },
  { _id: "69bd6bb2e1aa8f195c71c31f", FCTM_skill_name: "TYPESCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c336", FCTM_skill_name: "UI/UX" },
  { _id: "69bd6bb2e1aa8f195c71c32d", FCTM_skill_name: "VENTAS" },
  { _id: "69bd6bb2e1aa8f195c71c321", FCTM_skill_name: "VUE.JS" }
];

const camposSAO = [
  { key: "SAO_id", label: "ID Interno SAO" },
  { key: "SAO_username", label: "CIF" },
  { key: "SAO_registryDate", label: "Fecha de Registro" },
  { key: "SAO_accessDate", label: "Ultimo Acceso" },
  { key: "SAO_name", label: "Nombre / Razon Social" },
  { key: "SAO_organization", label: "Organizacion / Centro" },
  { key: "SAO_group", label: "Grupo / Curso" },
  { key: "SAO_email", label: "E-mail" },
  { key: "SAO_phone", label: "Telefono de Contacto" },
  { key: "SAO_company_FCT_Number", label: "Nº Convenio FE" },
  { key: "SAO_company_FCT_Date", label: "Fecha Convenio FE" },
  { key: "SAO_company_FPDual_Number", label: "Nº Convenio FE Intensiva" },
  { key: "SAO_company_FPDual_Date", label: "Fecha Convenio FE Intensiva" },
  { key: "SAO_company_city", label: "Localidad" },
  { key: "SAO_company_state", label: "Provincia" },
  { key: "SAO_company_address", label: "Direccion Social" },
  { key: "SAO_company_activity", label: "Actividad Economica" },
  { key: "SAO_company_nameManager", label: "Nombre del Representante / Gerente" },
  { key: "SAO_company_idManager", label: "DNI/NIE del Representante" },
  { key: "SAO_company_deedDate", label: "Fecha de Escritura" }
];

const buildNormalizationConfig = (categories) => [
  {
    field: "FCTM_company_category",
    options: categories,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  },
  {
    field: "FCTM_skills",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name",
    type: "multi"
  }
];

const ShowCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = useCategoryStore((state) => state.categories);
  const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const normalizationConfig = useMemo(
    () => buildNormalizationConfig(categories),
    [categories]
  );

  const camposFCTM = useMemo(
    () => [
      {
        key: "FCTM_company_category",
        label: "Familias Profesionales",
        type: "select-multi",
        options: categories,
        optionValue: "_id",
        optionLabel: "FCTM_category_name"
      },
      {
        key: "FCTM_skills",
        label: "Aptitudes/Tecnologias",
        type: "select-multi",
        options: skillOptions,
        optionValue: "_id",
        optionLabel: "FCTM_skill_name"
      },
      {
        key: "FCTM_company_openToHire",
        label: "Interesada en contratar",
        type: "select",
        options: [
          { _id: true, nombre: "Si" },
          { _id: false, nombre: "No" }
        ]
      },
      { key: "FCTM_company_other_contact", label: "Otro contacto", type: "text" },
      { key: "FCTM_company_observations", label: "Observaciones", type: "textarea" }
    ],
    [categories]
  );

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    await cargarCategorias();

    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const res = await sendRequest("GET", null, `/companies/${id}`);

    if (res.success) {
      const normalized = normalizeFromApi(res.data, currentNormalization);
      setData(normalized);
      setOriginalData(normalized);
      setAvatarUrl(res.data?.FCTM_documents[0]?.FCTM_document_url || "");
    } else {
      showAlert("Error al cargar la empresa", "error");
    }

    setLoading(false);
  }, [id, cargarCategorias]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleDeleteJobOffer = useCallback(
    async (jobOfferId) => {
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
    },
    [id, fetchCompany]
  );

  const columnasOfertas = useMemo(
    () => [
      { key: "FCTM_job_title", encabezado: "Titulo" },
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
    ],
    [navigate, id, handleDeleteJobOffer]
  );

  const handleSave = async () => {
    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const fctmOnly = pickFCTMFields(data);
    const payload = normalizeToApi(fctmOnly, currentNormalization);
    const res = await sendRequest("PATCH", payload, `/companies/${id}`);

    if (res.success) {
      const normalized = normalizeFromApi(res.data, currentNormalization);
      setData(normalized);
      setOriginalData(normalized);
      setIsEditing(false);
    } else {
      showAlert(res.message || "Error al guardar los cambios", "error");
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  if (loading) return <p>Cargando informacion...</p>;
  if (!data) return <p>Empresa no encontrada.</p>;

  return (
    <section>
      <ShowHeader
        title={`Ficha de ${data?.SAO_name || "Empresa"}`}
        onBack={() => navigate("/companies")}
      />

      <UserAvatarUploader
        userId={id}
        avatarUrl={avatarUrl}
        onUploadSuccess={fetchCompany}
      />

      <div className="mb-4">
        <h3>Informacion SAO</h3>
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
          formTitle="Gestion de Datos FCTM"
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
          onClick={() => navigate("/joboffers/new", { state: { companyId: id } })}
        >
          Nueva Oferta de Trabajo
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowCompany;
