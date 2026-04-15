import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  formatDateDDMMYYYYHHmm,
  getBackendHost,
  normalizeFromApi,
  normalizeToApi,
  ensureSkills // IMPORTANTE: Importar para procesar nuevas skills
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";

import useSkillStore from "../../store/skillStore";
import useCategoryStore from "../../store/categoryStore";

/* =========================
   MERGE HELPERS
========================= */
const mergeSkillOptions = (storeSkills = [], entitySkills = []) => {
  const merged = [...storeSkills];
  const seen = new Set(storeSkills.map(s => s._id));
  entitySkills.forEach(skill => {
    if (skill?._id && !seen.has(skill._id)) {
      merged.push(skill);
      seen.add(skill._id);
    }
  });
  return merged;
};

const mergeCategoryOptions = (storeCats = [], entityCats = []) => {
  const merged = [...storeCats];
  const seen = new Set(storeCats.map(c => c._id));
  entityCats.forEach(cat => {
    if (cat?._id && !seen.has(cat._id)) {
      merged.push(cat);
      seen.add(cat._id);
    }
  });
  return merged;
};

/* =========================
   SAO FIELDS
========================= */
const SAO_fields = [
  { key: "SAO_id", label: "SAO ID", type: "text" },
  { key: "SAO_username", label: "NIA", type: "text" },
  { key: "SAO_registryDate", label: "Register Date", type: "date" },
  { key: "SAO_accessDate", label: "Access Date", type: "date" },
  { key: "SAO_name", label: "Name", type: "text" },
  { key: "SAO_organization", label: "Organization", type: "text" },
  { key: "SAO_group", label: "Group", type: "text" },
  { key: "SAO_email", label: "Email", type: "text" },
  { key: "SAO_phone", label: "Phone", type: "text" },
  { key: "SAO_student_id", label: "Student ID", type: "text" },
  { key: "SAO_student_socialNumber", label: "Social Number", type: "text" },
  { key: "SAO_student_city", label: "City", type: "text" },
  { key: "SAO_student_state", label: "State", type: "text" },
  { key: "SAO_student_address", label: "Address", type: "text" }
];

/* =========================
   FCTM FIELDS (FACTORY)
========================= */
const buildFCTMFields = (skillOptions, categoryOptions) => [
  { key: "FCTM_student_observations", label: "Observaciones", type: "text" },
  { key: "FCTM_student_other_contact", label: "Contacto Alternativo", type: "text" },
  {
    key: "FCTM_student_openToWork",
    label: "Disponible",
    type: "select",
    options: [
      { _id: "true", nombre: "Sí" },
      { _id: "false", nombre: "No" }
    ],
    optionValue: "_id",
    optionLabel: "nombre"
  },
  {
    key: "FCTM_company_category",
    label: "Categorías",
    type: "select-multi",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name"
  },
  {
    key: "FCTM_skills",
    label: "Skills",
    type: "select-multi-creatable", // CAMBIO: Ahora permite crear skills
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  }
];

const ShowStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const skillOptionsStore = useSkillStore(state => state.skills);
  const cargarSkills = useSkillStore(state => state.cargarSkills);
  const categoriesStore = useCategoryStore(state => state.categories);
  const cargarCategorias = useCategoryStore(state => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const hostAPI = getBackendHost();

  useEffect(() => {
    cargarSkills();
    cargarCategorias();
  }, [cargarSkills, cargarCategorias]);

  // Mezclamos opciones del store con las que ya tiene el estudiante (para no perder etiquetas)
  const currentSkillOptions = useMemo(() => 
    mergeSkillOptions(skillOptionsStore, originalData?.FCTM_skills || []),
    [skillOptionsStore, originalData]
  );

  const currentCategoryOptions = useMemo(() => 
    mergeCategoryOptions(categoriesStore, originalData?.FCTM_company_category || []),
    [categoriesStore, originalData]
  );

  const normalizationConfig = useMemo(() => [
    {
      field: "FCTM_company_category",
      options: currentCategoryOptions,
      optionValue: "_id",
      optionLabel: "FCTM_category_name",
      type: "multi"
    },
    {
      field: "FCTM_skills",
      options: currentSkillOptions,
      optionValue: "_id",
      optionLabel: "FCTM_skill_name",
      type: "multi"
    }
  ], [currentSkillOptions, currentCategoryOptions]);

  const FCTM_fields = useMemo(
    () => buildFCTMFields(currentSkillOptions, currentCategoryOptions),
    [currentSkillOptions, currentCategoryOptions]
  );

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/students/${id}`);

    if (res.success) {
      const baseData = {
        ...res.data,
        FCTM_student_openToWork: String(res.data.FCTM_student_openToWork)
      };

      const responseConfig = [
        {
          field: "FCTM_company_category",
          options: mergeCategoryOptions(categoriesStore, res.data.FCTM_company_category || []),
          optionValue: "_id",
          optionLabel: "FCTM_category_name",
          type: "multi"
        },
        {
          field: "FCTM_skills",
          options: mergeSkillOptions(skillOptionsStore, res.data.FCTM_skills || []),
          optionValue: "_id",
          optionLabel: "FCTM_skill_name",
          type: "multi"
        }
      ];

      const normalized = normalizeFromApi(baseData, responseConfig);
      setData(normalized);
      setOriginalData(normalized);

      const avatarDoc = res.data?.FCTM_documents?.find(d => d.FCTM_document_type === "AVATAR");
      setAvatarUrl(avatarDoc?.FCTM_document_url || "");
    } else {
      showAlert(res.message, "error");
    }
    setLoading(false);
  }, [id, skillOptionsStore, categoriesStore]);

  useEffect(() => { fetchStudent(); }, [fetchStudent]);

  /* =========================
     HANDLE SAVE (CON ENSURE SKILLS)
  ========================= */
  const handleSave = async () => {
    try {
      // 1. Procesar skills (crear las nuevas y obtener IDs)
      const skillIds = await ensureSkills(data.FCTM_skills);

      // 2. Normalizar datos para la API
      const payloadNormalizado = normalizeToApi(data, normalizationConfig);

      // 3. Inyectar IDs de skills procesadas
      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds,
        // Aseguramos el booleano para el campo openToWork
        FCTM_student_openToWork: data.FCTM_student_openToWork === "true"
      };

      const res = await sendRequest("PATCH", finalPayload, `/students/${id}`);

      if (res.success) {
        // Opcional: refrescar el store global de skills si hubo creaciones
        cargarSkills();
        await fetchStudent();
        setIsEditing(false);
      } else {
        showAlert(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error al procesar las skills", "error");
    }
  };

  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const handleCancel = () => { setData(originalData); setIsEditing(false); };

  const columnasDocuments = [
    { key: "FCTM_document_name", encabezado: "Nombre" },
    { key: "FCTM_document_type", encabezado: "Tipo" },
    {
      key: "FCTM_document_url",
      encabezado: "Descarga",
      render: row =>
        row?.FCTM_document_url ? (
          <a href={hostAPI + row.FCTM_document_url} target="_blank" rel="noreferrer">Descargar</a>
        ) : "No disponible"
    },
    {
      key: "FCTM_inserted_date",
      encabezado: "Fecha",
      render: row => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)
    }
  ];

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>No se encontraron datos</p>;

  return (
    <section className="dashboard section">
      <ShowHeader title={`Ficha de ${data?.SAO_username || "Student"}`} onBack={() => navigate("/students")} />
      
      <UserAvatarUploader userId={id} avatarUrl={avatarUrl} onUploadSuccess={fetchStudent} />

      <ShowEditableForm
        formTitle="Información SAO"
        formId="saoForm"
        data={data}
        fields={SAO_fields}
        hideEditButton={true}
      />

      <ShowEditableForm
        formTitle="Datos FCTM"
        formId="fctmForm"
        data={data}
        fields={FCTM_fields}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      {data.FCTM_documents?.length > 0 && (
        <ListCRUD title="Documentos" datos={data.FCTM_documents} columnas={columnasDocuments} />
      )}
    </section>
  );
};

export default ShowStudent;