import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendRequest,
  showAlert,
  normalizeFromApi,
  normalizeToApi,
  ensureSkills
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import SectionChangePassword from "../../components/User/SectionChangePassword";
import useCategoryStore from "../../store/categoryStore";

const dummyTypes = [
  { _id: "TEXTO", nombre: "TEXTO" },
  { _id: "NUMERO", nombre: "NUMERO" },
  { _id: "BOOLEANO", nombre: "BOOLEANO" },
  { _id: "OTRO", nombre: "OTRO" }
];

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
  { key: "SAO_username", label: "Username:", type: "text" },
  { key: "SAO_email", label: "Email", type: "email" }
];

const columnasDocuments = [
  { key: "_id", encabezado: "#" },
  { key: "FCTM_document_name", encabezado: "Nombre" },
  { key: "FCTM_document_url", encabezado: "Ruta" }
];

const buildNormalizationConfig = (categories) => [
  {
    field: "FCTM_category",
    options: categories,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  }
];

const ShowDummy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categories = useCategoryStore((state) => state.categories);
  const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const normalizationConfig = useMemo(
    () => buildNormalizationConfig(categories),
    [categories]
  );

  const FCTM_FIELDS = useMemo(
    () => [
      { key: "FCTM_dummy_observations", label: "Observaciones", type: "textarea" },
      { key: "FCTM_dummy_other_contact", label: "Otro contacto", type: "text" },
      { key: "FCTM_dummy_description", label: "Descripcion", type: "text" },
      {
        key: "FCTM_dummy_type",
        label: "Tipo",
        type: "select",
        options: dummyTypes,
        optionValue: "_id",
        optionLabel: "nombre"
      },
      {
        key: "FCTM_category",
        label: "Categorias",
        type: "select-multi",
        options: categories,
        optionValue: "_id",
        optionLabel: "FCTM_category_name"
      },
      {
        key: "FCTM_skills",
        label: "Aptitudes/Tecnologias",
        type: "select-multi-creatable",
        options: skillOptions,
        optionValue: "_id",
        optionLabel: "FCTM_skill_name"
      }
    ],
    [categories]
  );

  const fetchDummy = useCallback(async () => {
    setLoading(true);
    await cargarCategorias();

    const currentCategories = useCategoryStore.getState().getCategoryArray();
    const currentNormalization = buildNormalizationConfig(currentCategories);
    const res = await sendRequest("GET", null, `/dummy/${id}`);

    if (res.success) {
      const dataNormalizada = normalizeFromApi(res.data, currentNormalization);
      setData(dataNormalizada);
      setOriginalData(dataNormalizada);
    } else {
      showAlert(res.message, "error");
    }

    setLoading(false);
  }, [id, cargarCategorias]);

  const handleSave = async () => {
    try {
      const currentCategories = useCategoryStore.getState().getCategoryArray();
      const currentNormalization = buildNormalizationConfig(currentCategories);
      const skillIds = await ensureSkills(data.FCTM_skills);

      const payloadNormalizado = normalizeToApi(data, currentNormalization);
      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds
      };

      const res = await sendRequest("PUT", finalPayload, `/dummy/${id}`);

      if (!res.success) {
        showAlert(res.message, "error");
        return;
      }

      const dataFinal = normalizeFromApi(res.data, currentNormalization);
      setData(dataFinal);
      setOriginalData(dataFinal);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      showAlert("Error critico", "error");
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchDummy();
  }, [fetchDummy]);

  if (loading) return <p className="p-5 text-center">Cargando...</p>;
  if (!data) return <p className="p-5 text-center">Sin datos</p>;

  return (
    <section className="dashboard section">
      <ShowHeader
        title={`Ficha de ${data?.SAO_username || "Dummy"}`}
        onBack={() => navigate("/dummy")}
      />

      <ShowEditableForm
        formTitle="Informacion de SAO"
        formId="saoForm"
        data={data}
        fields={SAO_FIELDS}
        hideEditButton={true}
      />

      <ShowEditableForm
        formTitle="Datos Adicionales"
        formId="fctmForm"
        data={data}
        fields={FCTM_FIELDS}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      <SectionChangePassword isEditing={isEditing} onChange={(pwd) => console.log(pwd)} />

      <ListCRUD title="Documentos" datos={data.FCTM_documents || []} columnas={columnasDocuments}>
        <button className="btn btn-success" onClick={() => navigate("/documents/new")}>
          Anadir
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowDummy;
