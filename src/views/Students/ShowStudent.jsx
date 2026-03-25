import React, { useState, useEffect, useCallback } from "react";
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



const skillOptions = [
  // Soft Skills
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

  // Tecnología / IT
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

  // Gestión y Marketing
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

  // Diseño y Social
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

  // Agro y Medio Ambiente
  { _id: "skill_67", FCTM_skill_name: "AGRICULTURA ECOLÓGICA" },
  { _id: "skill_68", FCTM_skill_name: "PAISAJISMO" },
  { _id: "skill_69", FCTM_skill_name: "GESTIÓN AMBIENTAL" },
  { _id: "skill_70", FCTM_skill_name: "BOTÁNICA" },
  { _id: "skill_71", FCTM_skill_name: "CONTROL DE PLAGAS" },
  { _id: "skill_72", FCTM_skill_name: "SOSTENIBILIDAD" },
  { _id: "skill_73", FCTM_skill_name: "GESTIÓN FORESTAL" },
  { _id: "skill_74", FCTM_skill_name: "JARDINERÍA" }
];

// Configs filtradas
const NORMALIZATION_CONFIG = [
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

// MIRIAM
const SAO_fields = [
  { key: "SAO_id", label: "SAO ID", type: "text"},
  { key: "SAO_username", label: "NIA", type: "text"},
  { key: "SAO_registryDate", label: "Register Date", type: "date" },
  { key: "SAO_accessDate", label: "Access Date", type: "date" },
  { key: "SAO_name", label: "Name", type: "text" },
  { key: "SAO_organization", label: "Organization", type: "text" },
  { key: "SAO_group", label: "Group", type: "text" },
  { key: "SAO_email", label: "Email", type: "text" },
  { key: "SAO_phone", label: "Phone", type: "text" },
  { key: "SAO_student_id", label: "Student ID", type: "text" },
  { key: "SAO_student_socialNumber", label: "Student social number", type: "text" },
  { key: "SAO_student_city", label: "Student city", type: "text" },
  { key: "SAO_student_state", label: "Student state", type: "text" },
  { key: "SAO_student_codeState", label: "Student code state", type: "text" },
  { key: "SAO_student_address", label: "Student adress", type: "text" },
  { key: "SAO_student_gender", label: "Student gender", type: "text" },
  { key: "SAO_student_visibleCompanies", label: "Student visible companies", type: "text" }
]

// CAROLINA
const FCTM_fields = [
  { key: "FCTM_student_observations", label: "Observaciones", type: "textarea" },
  { key: "FCTM_student_other_contact", label: "Contacto Alternativo", type: "text" },
  {
    key: "FCTM_student_openToWork",
    label: "En búsqueda activa / Disponible",
    type: "select",
    options: [
      { _id: true, nombre: "Sí" },
      { _id: false, nombre: "No" }
    ],
    optionValue: "_id",
    optionLabel: "nombre"
  }
];

const ShowStudent = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [originalData, setOriginalData] = useState(null)
    const [availableSkills, setAvailableSkills] = useState(skillOptions);
    const [selectedFile, setSelectedFile] = useState(null);

    const hostAPI = getBackendHost()

    const columnasDocuments = [
      { key: 'FCTM_document_name', encabezado: 'Nombre'},
      { key: 'FCTM_document_type', encabezado: 'Tipo'},
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
      { key: 'FCTM_inserted_date', 
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

    const fetchStudent = useCallback(async () => {
      setLoading(true);
      const res = await sendRequest("GET", null, `/students/${id}`);

      if (res.success) {
        // Para las skills, usamos las que vienen del backend para mapear IDs a nombres
        const currentConfig = NORMALIZATION_CONFIG.map(c => {
          if (c.field === "FCTM_skills" && res.data.FCTM_skills) {
            return { ...c, options: res.data.FCTM_skills };
          }
          return c;
        });

        const dataNormalizada = normalizeFromApi(res.data, currentConfig);

        dataNormalizada.SAO_registryDate = res.data.SAO_registryDate?.split("T")[0] || "";
        dataNormalizada.SAO_accessDate = res.data.SAO_accessDate?.split("T")[0] || "";

        setData(dataNormalizada);
        setOriginalData(dataNormalizada);
      }
      setLoading(false);
    }, [id]);

    const handleSave = async () => {
      try {
        let skillNames = [];
        if (data.FCTM_skills) {
          skillNames = data.FCTM_skills.map(s => {
            let name = typeof s === "string" ? s : (s.label || s.FCTM_skill_name);
            // Si el MultiSelect nos da {value, label}, el label es el nombre de la skill
            return name ? name.trim().toUpperCase() : null;
          }).filter(Boolean);
        }

        const resSkills = await sendRequest("POST", { names: skillNames }, "/skills/ensure");
        if (!resSkills.success) return showAlert("Error en habilidades: " + resSkills.message, "error");

        const skillIds = resSkills.data;
        const payloadNormalizado = normalizeToApi(data, NORMALIZATION_CONFIG);

        const finalPayload = {
          ...payloadNormalizado,
          FCTM_skills: skillIds,
          // Forzamos el casteo a booleano si es necesario
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
      fetchStudent();
    }, [id]); 

    if (loading && !data) return <p>Cargando datos...</p>
    if (!data && !loading) return <p>No se encontraron datos</p>

    const dynamicFCTMFields = [
      {
        key: "FCTM_skills",
        label: "Aptitudes/Skills",
        type: "select-multi-creatable",
        options: availableSkills.length > 0 ? availableSkills : skillOptions, 
        optionValue: "_id", 
        optionLabel: "FCTM_skill_name"
      },
      ...FCTM_fields,
    ];

    const filteredFCTMFields = dynamicFCTMFields.filter(field => {
      if (field.key === "FCTM_skills") return true;
      return field.key in data;
    }).map(field => {
      if (field.key === "FCTM_student_openToWork") {
        return { ...field, value: String(data[field.key] || false) }
      }
      return field;
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

export default ShowStudent