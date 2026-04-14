import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  confirmation,
  normalizeFromApi,
  normalizeToApi,
  pickFCTMFields,
  formatDateDDMMYYYY,
  getBackendHost
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";

import useSkillStore from "../../store/skillStore";
import useCategoryStore from "../../store/categoryStore";

/**
 * Merge skills (ya lo tenías correcto)
 */
const mergeSkillOptions = (storeSkills = [], entitySkills = []) => {
  const merged = [...storeSkills];
  const seen = new Set(storeSkills.map(s => s._id));

  entitySkills.forEach(skill => {
    if (
      skill &&
      typeof skill === "object" &&
      skill._id &&
      skill.FCTM_skill_name &&
      !seen.has(skill._id)
    ) {
      merged.push(skill);
      seen.add(skill._id);
    }
  });

  return merged;
};

/**
 * Merge categories (NUEVO)
 */
const mergeCategoryOptions = (storeCategories = [], entityCategories = []) => {
  const merged = [...storeCategories];
  const seen = new Set(storeCategories.map(c => c._id));

  entityCategories.forEach(cat => {
    if (
      cat &&
      typeof cat === "object" &&
      cat._id &&
      cat.FCTM_category_name &&
      !seen.has(cat._id)
    ) {
      merged.push(cat);
      seen.add(cat._id);
    }
  });

  return merged;
};

/**
 * Campos SAO (igual)
 */
const camposSAO = [
  { key: "SAO_id", label: "ID Interno SAO" },
  { key: "SAO_username", label: "CIF" },
  { key: "SAO_registryDate", label: "Fecha de Registro" },
  { key: "SAO_accessDate", label: "Último Acceso" },
  { key: "SAO_name", label: "Nombre / Razón Social" },
  { key: "SAO_organization", label: "Organización / Centro" },
  { key: "SAO_group", label: "Grupo / Curso" },
  { key: "SAO_email", label: "E-mail" },
  { key: "SAO_phone", label: "Teléfono de Contacto" }
];

/**
 * Campos FCTM (AHORA usan store categories)
 */
const buildCamposFCTM = (skillOptions, categoryOptions) => [
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
      { _id: true, nombre: "Sí" },
      { _id: false, nombre: "No" }
    ]
  },
  { key: "FCTM_company_other_contact", label: "Otro contacto", type: "text" },
  { key: "FCTM_company_observations", label: "Observaciones", type: "textarea" }
];

/**
 * Normalización
 */
const buildNormalizationConfig = (skillOptions, categoryOptions) => [
  {
    field: "FCTM_company_category",
    options: categoryOptions,
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

  const skillOptions = useSkillStore(state => state.skills);
  const cargarSkills = useSkillStore(state => state.cargarSkills);

  const categories = useCategoryStore(state => state.categories);
  const cargarCategorias = useCategoryStore(state => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  /**
   * Cargar stores
   */
  useEffect(() => {
    cargarSkills();
    cargarCategorias();
  }, [cargarSkills, cargarCategorias]);

  /**
   * Campos memoizados (IMPORTANTÍSIMO)
   */
  const camposFCTM = useMemo(() => {
    return buildCamposFCTM(skillOptions, categories || []);
  }, [skillOptions, categories]);

  const normalizationConfig = useMemo(() => {
    return buildNormalizationConfig(skillOptions, categories || []);
  }, [skillOptions, categories]);

  /**
   * FETCH COMPANY
   */
  const fetchCompany = useCallback(async () => {
    setLoading(true);

    const res = await sendRequest("GET", null, `/companies/${id}`);

    if (res.success) {
      const mergedCategories = mergeCategoryOptions(
        categories,
        res.data.FCTM_company_category || []
      );

      const mergedSkills = mergeSkillOptions(
        skillOptions,
        res.data.FCTM_skills || []
      );

      const config = buildNormalizationConfig(mergedSkills, mergedCategories);

      const normalized = normalizeFromApi(res.data, config);

      setData(normalized);
      setOriginalData(normalized);
      setAvatarUrl(res.data?.FCTM_documents?.[0]?.FCTM_document_url || "");
    } else {
      showAlert("Error al cargar la empresa", "error");
    }

    setLoading(false);
  }, [id, skillOptions, categories]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  /**
   * DELETE JOB OFFER
   */
  const handleDeleteJobOffer = useCallback(async (jobOfferId) => {
    const confirmed = await confirmation(
      "¿Seguro que quieres eliminar esta oferta de trabajo?"
    );
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

  /**
   * COLUMNAS OFERTAS
   */
  const columnasOfertas = useMemo(() => [
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
          onClick={() =>
            navigate(`/joboffers/${row._id}`, { state: { companyId: id } })
          }
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
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ], [navigate, id, handleDeleteJobOffer]);

  /**
   * SAVE
   */
  const handleSave = async () => {
    const fctmOnly = pickFCTMFields(data);
    const payload = normalizeToApi(fctmOnly, normalizationConfig);

    const res = await sendRequest("PATCH", payload, `/companies/${id}`);

    if (res.success) {
      const mergedCategories = mergeCategoryOptions(
        categories,
        res.data.FCTM_company_category || []
      );

      const mergedSkills = mergeSkillOptions(
        skillOptions,
        res.data.FCTM_skills || []
      );

      const config = buildNormalizationConfig(mergedSkills, mergedCategories);

      const normalized = normalizeFromApi(res.data, config);

      setData(normalized);
      setOriginalData(normalized);
      setIsEditing(false);
    } else {
      showAlert(res.message || "Error al guardar los cambios", "error");
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
        title={`Ficha de ${data?.SAO_name || "Empresa"}`}
        onBack={() => navigate("/companies")}
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
          hideEditButton
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
          onClick={() =>
            navigate("/joboffers/new", { state: { companyId: id } })
          }
        >
          Nueva Oferta de Trabajo
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowCompany;