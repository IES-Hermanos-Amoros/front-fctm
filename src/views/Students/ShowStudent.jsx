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

const SAO_FIELDS = [
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
  { key: "SAO_student_socialNumber", label: "Student social number", type: "text" },
  { key: "SAO_student_city", label: "Student city", type: "text" },
  { key: "SAO_student_state", label: "Student state", type: "text" },
  { key: "SAO_student_codeState", label: "Student code state", type: "text" },
  { key: "SAO_student_address", label: "Student address", type: "text" },
  { key: "SAO_student_gender", label: "Student gender", type: "text" },
  { key: "SAO_student_visibleCompanies", label: "Student visible companies", type: "text" }
];

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

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

const ShowStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = useCategoryStore((state) => state.categories);
  const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const hostAPI = getBackendHost();

  const normalizationConfig = useMemo(
    () => buildNormalizationConfig(categories),
    [categories]
  );

  const FCTM_FIELDS = useMemo(
    () => [
      { key: "FCTM_student_observations", label: "Observaciones", type: "text" },
      { key: "FCTM_student_other_contact", label: "Contacto Alternativo", type: "text" },
      {
        key: "FCTM_student_openToWork",
        label: "En busqueda activa / Disponible",
        type: "select",
        options: [
          { _id: true, nombre: "Si" },
          { _id: false, nombre: "No" }
        ],
        optionValue: "_id",
        optionLabel: "nombre"
      },
      {
        key: "FCTM_company_category",
        label: "Categorias",
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
      }
    ],
    [categories]
  );

  const columnasDocuments = [
    { key: "FCTM_document_name", encabezado: "Nombre" },
    { key: "FCTM_document_type", encabezado: "Tipo" },
    {
      key: "FCTM_document_url",
      encabezado: "Descarga",
      render: (row) => {
        if (!row) return "No disponible";

        const url = row.FCTM_document_url;
        return (
          <a href={hostAPI + url} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-download"></i>
          </a>
        );
      }
    },
    {
      key: "FCTM_inserted_date",
      encabezado: "Fecha",
      render: (row) => formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)
    },
    {
      key: "__delete",
      encabezado: "Eliminar",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteDocument(row._id)}
          title="Eliminar Documento"
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ];

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    await cargarCategorias();

    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const res = await sendRequest("GET", null, `/students/${id}`);

    if (res.success) {
      const baseData = {
        ...res.data,
        FCTM_student_openToWork: String(res.data.FCTM_student_openToWork),
        SAO_registryDate: formatDateForInput(res.data.SAO_registryDate),
        SAO_accessDate: formatDateForInput(res.data.SAO_accessDate)
      };

      const dataNormalizada = normalizeFromApi(baseData, currentNormalization);
      setData(dataNormalizada);
      setOriginalData(dataNormalizada);

      let nextAvatarUrl = "";
      if (res.data?.FCTM_documents?.length) {
        const avatarDoc = res.data.FCTM_documents.find(
          (document) => document.FCTM_document_type === "AVATAR"
        );

        if (avatarDoc?.FCTM_document_url) {
          nextAvatarUrl = avatarDoc.FCTM_document_url;
        }
      }

      setAvatarUrl(nextAvatarUrl);
    } else {
      console.error("Error al cargar el estudiante: ", res.message);
    }

    setLoading(false);
  }, [id, cargarCategorias]);

  const handleSave = async () => {
    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const payloadNormalizado = normalizeToApi(data, currentNormalization);
    const res = await sendRequest("PATCH", payloadNormalizado, `/students/${id}`);

    if (res.success) {
      const dataFinal = normalizeFromApi(
        {
          ...res.data,
          FCTM_student_openToWork: String(res.data.FCTM_student_openToWork),
          SAO_registryDate: formatDateForInput(res.data.SAO_registryDate),
          SAO_accessDate: formatDateForInput(res.data.SAO_accessDate)
        },
        currentNormalization
      );

      setData(dataFinal);
      setOriginalData(dataFinal);
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
    setIsEditing(false);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return showAlert("Selecciona un archivo", "warning");
    }

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("type", "CURRICULUM VITAE");
    formData.append("userId", id);

    const res = await sendRequest("POST", formData, "/documents/upload");

    if (res.success) {
      showAlert("CV subido con exito", "success");
      setSelectedFile(null);
      fetchStudent();
    } else {
      showAlert(res.message || "Error al subir el CV", "error");
    }
  };

  const handleDeleteDocument = async (docId) => {
    const confirmado = await confirmation("¿Seguro que quieres eliminar este CV?");
    if (!confirmado) return;

    const res = await sendRequest("DELETE", undefined, `/documents/${docId}`);

    if (res.success) {
      const updatedDocuments = data.FCTM_documents.filter((item) => item !== docId);
      const patchRes = await sendRequest(
        "PATCH",
        { FCTM_documents: updatedDocuments },
        `/students/${id}`
      );

      if (patchRes.success) {
        showAlert("Documento eliminado y alumno actualizado", "success");

        setData((prev) => ({
          ...prev,
          FCTM_documents: updatedDocuments
        }));

        fetchStudent();
      } else {
        showAlert(`Error actualizando el alumno: ${patchRes.message}`, "error");
      }
    } else {
      showAlert(res.message, "error");
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>No se encontraron datos</p>;

  const filteredFCTMFields = FCTM_FIELDS.filter((field) => field.key in data).map((field) => {
    if (field.key === "FCTM_student_openToWork") {
      return {
        ...field,
        value: data[field.key] === "true"
      };
    }

    return field;
  });

  const filteredSAOFields = SAO_FIELDS.filter((field) => field.key in data);

  return (
    <div>
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
          formTitle="Informacion de SAO"
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
            <h5>Adjuntar Curriculum Vitae</h5>

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

        {data.FCTM_documents.length === 0 ? (
          <h4>Todavia no se ha adjuntado un Curriculum Vitae (pulsa en "Editar" para subir tu CV)</h4>
        ) : (
          <ListCRUD
            title="Curriculums Vitae Adjuntos"
            datos={data.FCTM_documents}
            columnas={columnasDocuments}
          />
        )}
      </section>
    </div>
  );
};

export default ShowStudent;
