import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  confirmation,
  showAlert,
  formatDateDDMMYYYYHHmm,
  getBackendHost,
  normalizeFromApi,
  normalizeToApi,
  ensureSkills
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
    if (skill && skill._id && !seen.has(skill._id)) {
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
    if (cat && cat._id && !seen.has(cat._id)) {
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
      { _id: true, nombre: "Sí" },
      { _id: false, nombre: "No" }
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
    type: "select-multi-creatable",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  }
];

/* =========================
   COMPONENT
========================= */

const ShowStudent = () => {
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
  const hostAPI = getBackendHost();

  /* =========================
     LOAD STORES
  ========================= */

  useEffect(() => {
    cargarSkills();
    cargarCategorias();
  }, [cargarSkills, cargarCategorias]);

  /* =========================
     CONFIG MEMO
  ========================= */

  const normalizationConfig = useMemo(() => {
    const safeSkills = skillOptions || [];
    const safeCats = categories || [];

    return [
      {
        field: "FCTM_company_category",
        options: safeCats,
        optionValue: "_id",
        optionLabel: "FCTM_category_name",
        type: "multi"
      },
      {
        field: "FCTM_skills",
        options: safeSkills,
        optionValue: "_id",
        optionLabel: "FCTM_skill_name",
        type: "multi"
      }
    ];
  }, [skillOptions, categories]);

  const FCTM_fields = useMemo(
    () => buildFCTMFields(skillOptions, categories || []),
    [skillOptions, categories]
  );

  /* =========================
     FETCH
  ========================= */

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
          options: mergeCategoryOptions(categories, res.data.FCTM_company_category || []),
          optionValue: "_id",
          optionLabel: "FCTM_category_name",
          type: "multi"
        },
        {
          field: "FCTM_skills",
          options: mergeSkillOptions(skillOptions, res.data.FCTM_skills || []),
          optionValue: "_id",
          optionLabel: "FCTM_skill_name",
          type: "multi"
        }
      ];

      const normalized = normalizeFromApi(baseData, responseConfig);

      setData(normalized);
      setOriginalData(normalized);

      const avatarDoc = res.data?.FCTM_documents?.find(
        d => d.FCTM_document_type === "AVATAR"
      );

      setAvatarUrl(avatarDoc?.FCTM_document_url || "");
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id, skillOptions, categories]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  /* =========================
     HANDLERS
  ========================= */

  const handleSave = async () => {
    try {
      // 1. Asegurar que todas las skills existan (crea nuevas si es necesario)
      const skillIds = await ensureSkills(data.FCTM_skills);

      // 2. Normalizar TODO (incluyendo la estructura, las skills se ignoran en normalizeToApi)
      const payloadNormalizado = normalizeToApi(data, normalizationConfig);

      // 3. Inyectar los IDs finales manualmente (sobrescribe cualquier cosa)
      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds
      };

      console.log("Final Payload antes de enviar:", finalPayload);

      // 4. Guardar el estudiante
      const res = await sendRequest("PATCH", finalPayload, `/students/${id}`);

      if (res.success) {
        await fetchStudent();
        setIsEditing(false);
      } else {
        showAlert(res.message, "error");
      }
    } catch (err) {
      console.error("Error en handleSave:", err);
      showAlert("Error crítico al guardar", "error");
    }
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  const columnasDocuments = [
    { key: "FCTM_document_name", encabezado: "Nombre" },
    { key: "FCTM_document_type", encabezado: "Tipo" },
    {
      key: "FCTM_document_url",
      encabezado: "Descarga",
      render: row =>
        row?.FCTM_document_url ? (
          <a href={hostAPI + row.FCTM_document_url} target="_blank" rel="noreferrer">
            Descargar
          </a>
        ) : (
          "No disponible"
        )
    },
    {
      key: "FCTM_inserted_date",
      encabezado: "Fecha",
      render: row => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)
    }
  ];

  /* =========================
     UI
  ========================= */

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>No se encontraron datos</p>;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Ficha de ${data?.SAO_username || "Student"}`}
        onBack={() => navigate("/students")}
      />

      <UserAvatarUploader
        userId={id}
        avatarUrl={avatarUrl}
        onUploadSuccess={fetchStudent}
      />

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
        <ListCRUD
          title="Documentos"
          datos={data.FCTM_documents}
          columnas={columnasDocuments}
        />
      )}
    </section>
  );
};

export default ShowStudent;