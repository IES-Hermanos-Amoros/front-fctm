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
  ensureSkills // IMPORTANTE: Asegúrate de importar esto
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";

import useSkillStore from "../../store/skillStore";
import useCategoryStore from "../../store/categoryStore";

// --- HELPERS DE MERGE ---
const mergeSkillOptions = (storeSkills = [], entitySkills = []) => {
  const merged = [...storeSkills];
  const seen = new Set(storeSkills.map(s => s._id));
  entitySkills.forEach(skill => {
    if (skill?._id && skill.FCTM_skill_name && !seen.has(skill._id)) {
      merged.push(skill);
      seen.add(skill._id);
    }
  });
  return merged;
};

const mergeCategoryOptions = (storeCategories = [], entityCategories = []) => {
  const merged = [...storeCategories];
  const seen = new Set(storeCategories.map(c => c._id));
  entityCategories.forEach(cat => {
    if (cat?._id && cat.FCTM_category_name && !seen.has(cat._id)) {
      merged.push(cat);
      seen.add(cat._id);
    }
  });
  return merged;
};

// --- CAMPOS ---
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
    type: "select-multi-creatable", // Habilita la creación de nuevas skills
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

  // STORES
  const skillOptionsStore = useSkillStore(state => state.skills);
  const cargarSkills = useSkillStore(state => state.cargarSkills);
  const categoriesStore = useCategoryStore(state => state.categories);
  const cargarCategorias = useCategoryStore(state => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    cargarSkills();
    cargarCategorias();
  }, [cargarSkills, cargarCategorias]);

  // Memoización de opciones mezcladas para el formulario
  const currentSkillOptions = useMemo(() => 
    mergeSkillOptions(skillOptionsStore, originalData?.FCTM_skills || []),
    [skillOptionsStore, originalData]
  );

  const currentCategoryOptions = useMemo(() => 
    mergeCategoryOptions(categoriesStore, originalData?.FCTM_company_category || []),
    [categoriesStore, originalData]
  );

  const camposFCTM = useMemo(() => 
    buildCamposFCTM(currentSkillOptions, currentCategoryOptions),
    [currentSkillOptions, currentCategoryOptions]
  );

  const normalizationConfig = useMemo(() => 
    buildNormalizationConfig(currentSkillOptions, currentCategoryOptions),
    [currentSkillOptions, currentCategoryOptions]
  );

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/companies/${id}`);

    if (res.success) {
      // Normalizamos con los campos actuales
      const config = buildNormalizationConfig(
        mergeSkillOptions(skillOptionsStore, res.data.FCTM_skills || []),
        mergeCategoryOptions(categoriesStore, res.data.FCTM_company_category || [])
      );

      const normalized = normalizeFromApi(res.data, config);
      setData(normalized);
      setOriginalData(normalized);
      setAvatarUrl(res.data?.FCTM_documents?.[0]?.FCTM_document_url || "");
    } else {
      showAlert("Error al cargar la empresa", "error");
    }
    setLoading(false);
  }, [id, skillOptionsStore, categoriesStore]);

  useEffect(() => { fetchCompany(); }, [fetchCompany]);

  // --- SAVE ACTUALIZADO (ESTILO SHOWDUMMY) ---
  const handleSave = async () => {
    try {
      // 1. Asegurar que las nuevas skills se creen en BD y obtener IDs
      const skillIds = await ensureSkills(data.FCTM_skills);

      // 2. Extraer solo campos FCTM y normalizar (para categorías, etc.)
      const fctmOnly = pickFCTMFields(data);
      const payloadNormalizado = normalizeToApi(fctmOnly, normalizationConfig);

      // 3. Inyectar los IDs de las skills procesadas
      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds
      };

      const res = await sendRequest("PATCH", finalPayload, `/companies/${id}`);

      if (res.success) {
        // Al recibir la respuesta, volvemos a normalizar para refrescar la UI
        const config = buildNormalizationConfig(
          mergeSkillOptions(skillOptionsStore, res.data.FCTM_skills || []),
          mergeCategoryOptions(categoriesStore, res.data.FCTM_company_category || [])
        );
        const normalized = normalizeFromApi(res.data, config);
        
        setData(normalized);
        setOriginalData(normalized);
        setIsEditing(false);
        // Opcional: Recargar store global si se crearon nuevas skills
        cargarSkills(); 
      } else {
        showAlert(res.message || "Error al guardar los cambios", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error crítico al procesar skills", "error");
    }
  };

  const handleDeleteJobOffer = useCallback(async (jobOfferId) => {
    const confirmed = await confirmation("¿Eliminar oferta?");
    if (!confirmed) return;
    const res = await sendRequest("DELETE", null, `/joboffers/${jobOfferId}?companyId=${id}`);
    if (res.success) await fetchCompany();
    else showAlert("Error al eliminar", "error");
  }, [id, fetchCompany]);

  const columnasOfertas = useMemo(() => [
    { key: "FCTM_job_title", encabezado: "Título" },
    { key: "FCTM_job_status", encabezado: "Estado" },
    {
      key: "__show",
      encabezado: "Ver",
      render: (row) => (
        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/joboffers/${row._id}`, { state: { companyId: id } })}>
          <i className="bi bi-search"></i>
        </button>
      )
    },
    {
      key: "__delete",
      encabezado: "Borrar",
      render: (row) => (
        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteJobOffer(row._id)}>
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ], [navigate, id, handleDeleteJobOffer]);

  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const handleCancel = () => { setData(originalData); setIsEditing(false); };

  if (loading) return <p>Cargando información...</p>;
  if (!data) return <p>Empresa no encontrada.</p>;

  return (
    <section>
      <ShowHeader title={`Ficha de ${data?.SAO_name || "Empresa"}`} onBack={() => navigate("/companies")} />
      
      <UserAvatarUploader userId={id} avatarUrl={avatarUrl} onUploadSuccess={fetchCompany} />

      <ShowEditableForm
        formTitle="Datos de SAO"
        formId="saoForm"
        data={data}
        fields={camposSAO}
        hideEditButton
      />

      <hr />

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

      <hr />

      <ListCRUD title="Ofertas Relacionadas" datos={data.FCTM_job_offers || []} columnas={columnasOfertas}>
        <button className="btn btn-primary" onClick={() => navigate("/joboffers/new", { state: { companyId: id } })}>
          Nueva Oferta
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowCompany;