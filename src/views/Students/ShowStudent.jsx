import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  confirmation,
  showAlert,
  formatDateDDMMYYYYHHmm,
  getBackendHost,
  normalizeFromApi,
  normalizeToApi
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";

<<<<<<< HEAD
const categoryOptions = [
  { _id: "69a82074499df1aec1d2477e", FCTM_category_name: "AGRO-JARDINERIA Y COMPOSICIONES FLORALES" },
  { _id: "69a82074499df1aec1d2477f", FCTM_category_name: "DESARROLLO DE APLICACIONES WEB" },
  { _id: "69a82074499df1aec1d24780", FCTM_category_name: "EDUCACIÓN INFANTIL" },
  { _id: "69a82074499df1aec1d24781", FCTM_category_name: "GESTIÓN FORESTAL Y DEL MEDIO NATURAL" },
  { _id: "69a82074499df1aec1d24782", FCTM_category_name: "INTEGRACIÓN SOCIAL" },
  { _id: "69a82074499df1aec1d24783", FCTM_category_name: "PRODUCCIÓN AGROECOLÓGICA" },
  { _id: "69a82074499df1aec1d24784", FCTM_category_name: "SISTEMAS MICROINFORMÁTICOS Y REDES" }
];

const skillOptions = [
  { _id: "skill_01", FCTM_skill_name: "LIDERAZGO" },
  { _id: "skill_02", FCTM_skill_name: "TRABAJO EN EQUIPO" },
  { _id: "skill_03", FCTM_skill_name: "COMUNICACIÓN EFECTIVA" },
  { _id: "skill_04", FCTM_skill_name: "RESOLUCIÓN DE PROBLEMAS" },
  { _id: "skill_05", FCTM_skill_name: "GESTIÓN DEL TIEMPO" },
  { _id: "skill_06", FCTM_skill_name: "PENSAMIENTO CRÍTICO" },
  { _id: "skill_07", FCTM_skill_name: "ADAPTABILIDAD" },
  { _id: "skill_08", FCTM_skill_name: "NEGOCIACIÓN" },
  { _id: "skill_09", FCTM_skill_name: "INTELIGENCIA EMOCIONAL" },
  { _id: "skill_10", FCTM_skill_name: "CREATIVIDAD" },
  { _id: "skill_11", FCTM_skill_name: "HABLAR EN PÚBLICO" },
  { _id: "skill_12", FCTM_skill_name: "EMPATÍA" },
  { _id: "skill_13", FCTM_skill_name: "DESARROLLO WEB" },
  { _id: "skill_14", FCTM_skill_name: "JAVASCRIPT" },
  { _id: "skill_15", FCTM_skill_name: "PYTHON" },
  { _id: "skill_16", FCTM_skill_name: "JAVA" },
  { _id: "skill_17", FCTM_skill_name: "HTML5" },
  { _id: "skill_18", FCTM_skill_name: "CSS3" },
  { _id: "skill_19", FCTM_skill_name: "REACT" },
  { _id: "skill_20", FCTM_skill_name: "NODE.JS" },
  { _id: "skill_21", FCTM_skill_name: "SQL" },
  { _id: "skill_22", FCTM_skill_name: "NOSQL" },
  { _id: "skill_23", FCTM_skill_name: "CLOUD COMPUTING" },
  { _id: "skill_24", FCTM_skill_name: "CIBERSEGURIDAD" },
  { _id: "skill_25", FCTM_skill_name: "GIT" },
  { _id: "skill_26", FCTM_skill_name: "DOCKER" },
  { _id: "skill_27", FCTM_skill_name: "KUBERNETES" },
  { _id: "skill_28", FCTM_skill_name: "INTELIGENCIA ARTIFICIAL" },
  { _id: "skill_29", FCTM_skill_name: "MACHINE LEARNING" },
  { _id: "skill_30", FCTM_skill_name: "SOPORTE TÉCNICO" },
  { _id: "skill_31", FCTM_skill_name: "ADMINISTRACIÓN DE SISTEMAS" },
  { _id: "skill_32", FCTM_skill_name: "REDES DE COMPUTADORES" },
  { _id: "skill_33", FCTM_skill_name: "TYPESCRIPT" },
  { _id: "skill_34", FCTM_skill_name: "ANGULAR" },
  { _id: "skill_35", FCTM_skill_name: "VUE.JS" },
  { _id: "skill_36", FCTM_skill_name: "AWS" },
  { _id: "skill_37", FCTM_skill_name: "AZURE" },
  { _id: "skill_38", FCTM_skill_name: "PHP" },
  { _id: "skill_39", FCTM_skill_name: "C#" },
  { _id: "skill_40", FCTM_skill_name: "C++" },
  { _id: "skill_41", FCTM_skill_name: "GESTIÓN DE PROYECTOS" },
  { _id: "skill_42", FCTM_skill_name: "ESTRATEGIA DE NEGOCIO" },
  { _id: "skill_43", FCTM_skill_name: "DESARROLLO DE NEGOCIO" },
  { _id: "skill_44", FCTM_skill_name: "PLANIFICACIÓN ESTRATÉGICA" },
  { _id: "skill_45", FCTM_skill_name: "ANÁLISIS DE DATOS" },
  { _id: "skill_46", FCTM_skill_name: "RECURSOS HUMANOS" },
  { _id: "skill_47", FCTM_skill_name: "VENTAS" },
  { _id: "skill_48", FCTM_skill_name: "ATENCIÓN AL CLIENTE" },
  { _id: "skill_49", FCTM_skill_name: "MARKETING DIGITAL" },
  { _id: "skill_50", FCTM_skill_name: "SEO" },
  { _id: "skill_51", FCTM_skill_name: "SEM" },
  { _id: "skill_52", FCTM_skill_name: "CONTENT MARKETING" },
  { _id: "skill_53", FCTM_skill_name: "GOOGLE ANALYTICS" },
  { _id: "skill_54", FCTM_skill_name: "E-COMMERCE" },
  { _id: "skill_55", FCTM_skill_name: "DISEÑO GRÁFICO" },
  { _id: "skill_56", FCTM_skill_name: "UI/UX" },
  { _id: "skill_57", FCTM_skill_name: "FIGMA" },
  { _id: "skill_58", FCTM_skill_name: "ADOBE PHOTOSHOP" },
  { _id: "skill_59", FCTM_skill_name: "ADOBE ILLUSTRATOR" },
  { _id: "skill_60", FCTM_skill_name: "EDICIÓN DE VÍDEO" },
  { _id: "skill_61", FCTM_skill_name: "DOCENCIA" },
  { _id: "skill_62", FCTM_skill_name: "E-LEARNING" },
  { _id: "skill_63", FCTM_skill_name: "INTERVENCIÓN SOCIAL" },
  { _id: "skill_64", FCTM_skill_name: "INTEGRACIÓN SOCIAL" },
  { _id: "skill_65", FCTM_skill_name: "PSICOLOGÍA" },
  { _id: "skill_66", FCTM_skill_name: "ORIENTACIÓN LABORAL" },
  { _id: "skill_67", FCTM_skill_name: "AGRICULTURA ECOLÓGICA" },
  { _id: "skill_68", FCTM_skill_name: "PAISAJISMO" },
  { _id: "skill_69", FCTM_skill_name: "GESTIÓN AMBIENTAL" },
  { _id: "skill_70", FCTM_skill_name: "BOTÁNICA" },
  { _id: "skill_71", FCTM_skill_name: "CONTROL DE PLAGAS" },
  { _id: "skill_72", FCTM_skill_name: "SOSTENIBILIDAD" },
  { _id: "skill_73", FCTM_skill_name: "GESTIÓN FORESTAL" },
  { _id: "skill_74", FCTM_skill_name: "JARDINERÍA" }
];

const NORMALIZATION_CONFIG = [
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
  },
  {
    field: "FCTM_student_openToWork",
    type: "boolean"
  }
];
=======
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
>>>>>>> 40b94df31fb6969c5d4136d9795b88cef31e3da5

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

<<<<<<< HEAD
const FCTM_fields = [
  { key: "FCTM_student_observations", label: "Observaciones", type: "textarea" },
  { key: "FCTM_student_other_contact", label: "Contacto Alternativo", type: "text" },
=======
/* =========================
   FCTM FIELDS (FACTORY)
========================= */

const buildFCTMFields = (skillOptions, categoryOptions) => [
  { key: "FCTM_student_observations", label: "Observaciones", type: "text" },
  { key: "FCTM_student_other_contact", label: "Contacto Alternativo", type: "text" },

>>>>>>> 40b94df31fb6969c5d4136d9795b88cef31e3da5
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
    type: "select-multi",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  }
];
<<<<<<< HEAD

const ShowStudent = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null)
  const [availableSkills, setAvailableSkills] = useState(skillOptions);
  const [availableCategories, setAvailableCategories] = useState(categoryOptions);
  const [selectedFile, setSelectedFile] = useState(null);

  const hostAPI = getBackendHost()

  const columnasDocuments = [
    { key: 'FCTM_document_name', encabezado: 'Nombre' },
    { key: 'FCTM_document_type', encabezado: 'Tipo' },
    {
      key: 'FCTM_document_url',
      encabezado: 'Descarga',
      render: (row) => {
        if (!row) return "No disponible"
        const url = row.FCTM_document_url
        return (
          <a href={hostAPI + url} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-download"></i>
          </a>
        )
      }
    },
    {
      key: 'FCTM_inserted_date',
      encabezado: 'Fecha ',
      render: (row) => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)
    },
    {
      key: '__delete',
      encabezado: 'Eliminar',
      render: row => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteDocument(row._id)}
          title="Eliminar Documento"
        >
          <i className="bi bi-trash"></i>
        </button>
      ),
    }
  ]

  const fetchOptions = useCallback(async () => {
    try {
      const resSkills = await sendRequest("GET", null, "/skills/search?q=");
      if (resSkills.success && Array.isArray(resSkills.data) && resSkills.data.length > 0) {
        setAvailableSkills(resSkills.data);
      }

      const resCat = await sendRequest("GET", null, "/categories");
      if (resCat.success && Array.isArray(resCat.data) && resCat.data.length > 0) {
        setAvailableCategories(resCat.data);
      }
    } catch (error) {
      console.warn("No se pudieron cargar opciones dinámicas del backend.");
    }
  }, []);

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/students/${id}`);

    if (res.success) {
      const combinedCats = availableCategories.length > 0 ? availableCategories : categoryOptions;
      const combinedSkills = availableSkills.length > 0 ? availableSkills : skillOptions;
      
      const currentConfig = NORMALIZATION_CONFIG.map(c => {
        if (c.field === "FCTM_company_category") return { ...c, options: combinedCats };
        if (c.field === "FCTM_skills") return { ...c, options: combinedSkills };
        return c;
      });

      const dataNormalizada = normalizeFromApi(res.data, currentConfig);

      dataNormalizada.FCTM_student_openToWork = String(!!res.data.FCTM_student_openToWork);
      
      dataNormalizada.FCTM_company_category = (res.data.FCTM_company_category || []).map(catId => {
        if (typeof catId === 'object') return catId;
        const found = combinedCats.find(c => c._id === catId);
        return found ? found : { _id: catId, FCTM_category_name: catId };
      });

      dataNormalizada.FCTM_skills = (res.data.FCTM_skills || []).map(skillId => {
        if (typeof skillId === 'object') return skillId;
        const found = combinedSkills.find(s => s._id === skillId);
        return found ? found : { _id: skillId, FCTM_skill_name: skillId };
      });
      
      dataNormalizada.SAO_registryDate = res.data.SAO_registryDate?.split("T")[0] || "";
      dataNormalizada.SAO_accessDate = res.data.SAO_accessDate?.split("T")[0] || "";

      setData(dataNormalizada);
      setOriginalData(dataNormalizada);
    }
    setLoading(false);
  }, [id, availableSkills, availableCategories]);

  const handleSave = async () => {
    try {
      let skillNames = [];
      if (data.FCTM_skills) {
        skillNames = data.FCTM_skills.map(s => {
          let name = typeof s === "string" ? s : (s.FCTM_skill_name || s.label);
          return name ? name.trim().toUpperCase() : null;
        }).filter(Boolean);
      }

      const resSkills = await sendRequest("POST", { names: skillNames }, "/skills/ensure");
      if (!resSkills.success) return showAlert("Error en habilidades: " + resSkills.message, "error");

      const skillIds = resSkills.data;

      const categoryIds = (data.FCTM_company_category || []).map(c => 
        typeof c === "object" ? (c._id || c.value) : c
      ).filter(Boolean);

      const payloadNormalizado = normalizeToApi(data, NORMALIZATION_CONFIG);

      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds,
        FCTM_company_category: categoryIds, 
        FCTM_student_openToWork: String(data.FCTM_student_openToWork) === "true"
      };

      const res = await sendRequest("PATCH", finalPayload, `/students/${id}`);

      if (res.success) {
        showAlert("Estudiante actualizado", "success");
        setIsEditing(false);
        fetchStudent(); 
      } else {
        showAlert(res.message, "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showAlert("Error al guardar", "error");
    }
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setData(originalData)
    setIsEditing(false)
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return showAlert("Selecciona un archivo", "warning");

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("type", "CURRÍCULUM VITAE");
    formData.append("userId", id);

    const res = await sendRequest("POST", formData, `/documents/upload`);

    if (res.success) {
      showAlert("CV subido con éxito", "success");
      setSelectedFile(null);
      fetchStudent();
    } else {
      showAlert(res.message || "Error al subir el CV", "error");
    }
  };

  const handleDeleteDocument = async (docId) => {
    const confirmado = await confirmation('¿Seguro que quieres eliminar este CV?')
    if (!confirmado) return;

    const res = await sendRequest('DELETE', undefined, `/documents/${docId}`);

    if (res.success) {
      const updatedDocuments = data.FCTM_documents.filter(item => item._id !== docId);
      const patchRes = await sendRequest("PATCH", { FCTM_documents: updatedDocuments }, `/students/${id}`);

      if (patchRes.success) {
        showAlert('Documento eliminado correctamente', 'success');
        fetchStudent();
      } else {
        showAlert('Error actualizando alumno', 'error');
      }
    } else {
      showAlert(res.message || 'Error DELETE', "error");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (loading && !data) return <p>Cargando datos...</p>
  if (!data && !loading) return <p>No se encontraron datos</p>

  // --- CONFIGURACIÓN DE CAMPOS DINÁMICOS ---
  
  // 1. Definimos el campo de categorías
  const CATEGORY_FIELD = {
    key: "FCTM_company_category",
    label: "Categorías/Familias Profesionales",
    type: "select-multi-creatable",
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    options: availableCategories.length > 0 ? availableCategories : categoryOptions
  };  

  // 2. Construimos el array de campos para el formulario "Datos Adicionales"
  const dynamicFCTMFields = [
    ...FCTM_fields,    // Observaciones, Contacto, OpenToWork
    CATEGORY_FIELD,    // <--- CATEGORÍAS AQUÍ (Encima de skills)
    {
      key: "FCTM_skills",
      label: "Aptitudes/Skills",
      type: "select-multi-creatable",
      options: availableSkills.length > 0 ? availableSkills : skillOptions,
      optionValue: "_id",
      optionLabel: "FCTM_skill_name"
    }
  ];

  const filteredFCTMFields = dynamicFCTMFields.filter(field => {
    const siempreVisibles = ["FCTM_company_category", "FCTM_skills", "FCTM_student_openToWork"];
    if (siempreVisibles.includes(field.key)) return true;
    return field.key in data;
  });

  const filteredSAOFields = SAO_fields.filter(field => field.key in data);

  return (
    <div>
      <section className="dashboard section">
        <ShowHeader
          title={`Ficha de ${data?.SAO_username || 'Student'}`}
          onBack={() => navigate('/students')}
        />

        <ShowEditableForm
          formTitle="Información de SAO"
          formId="saoForm"
          data={data}
          fields={filteredSAOFields}
          hideEditButton={true}
        />

        {/* Aquí ahora están todos los campos: Observaciones, OpenToWork, Categorías y Skills */}
        <ShowEditableForm
          formTitle="Datos Adicionales"
          formId="fctmForm"
          data={data}
          fields={filteredFCTMFields}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleChange}
        />

        {isEditing && (
          <div className="card p-3 mt-3">
            <h5>Adjuntar Currículum Vitae</h5>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleFileUpload}
            >
              Subir
            </button>
          </div>
        )}

        {data.FCTM_documents?.length === 0 ? (
          <h4 className="mt-4">Todavía no se ha adjuntado un Currículum Vitae (pulsa en "Editar" para subir tu CV)</h4>
        ) : (
          <ListCRUD
            title="Currículums Vitae Adjuntos"
            datos={data.FCTM_documents || []}
            columnas={columnasDocuments}
          />
        )}

      </section>
    </div>
  )
}
=======

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
    const fctmOnly = normalizeToApi(data, normalizationConfig);

    const res = await sendRequest("PATCH", fctmOnly, `/students/${id}`);

    if (res.success) {
      await fetchStudent();
      setIsEditing(false);
    } else {
      showAlert(res.message, "error");
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
>>>>>>> 40b94df31fb6969c5d4136d9795b88cef31e3da5

export default ShowStudent;