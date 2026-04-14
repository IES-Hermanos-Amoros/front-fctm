import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest, showAlert, normalizeToApi } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
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

const buildNormalizationConfig = (categories) => [
  {
    field: "FCTM_category",
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

const NewDummy = () => {
  const navigate = useNavigate();
  const categories = useCategoryStore((state) => state.categories);
  const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);

  const [data, setData] = useState({
    FCTM_dummy_observations: "",
    FCTM_dummy_other_contact: "",
    FCTM_dummy_description: "",
    FCTM_dummy_type: "OTRO",
    FCTM_category: []
  });

  const normalizationConfig = useMemo(
    () => buildNormalizationConfig(categories),
    [categories]
  );

  const FCTM_fields = useMemo(
    () => [
      { key: "FCTM_dummy_observations", label: "Observaciones", type: "textarea", required: true },
      { key: "FCTM_dummy_other_contact", label: "Otro contacto", type: "text" },
      { key: "FCTM_dummy_description", label: "Descripcion", type: "text" },
      {
        key: "FCTM_dummy_type",
        label: "Tipo",
        type: "select",
        options: dummyTypes,
        optionValue: "_id",
        optionLabel: "nombre",
        required: true
      },
      {
        key: "FCTM_category",
        label: "Categorias",
        type: "select-multi",
        options: categories,
        optionValue: "_id",
        optionLabel: "FCTM_category_name",
        required: true
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

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      let skillNames = [];
      if (data.FCTM_skills) {
        skillNames = data.FCTM_skills
          .map((skill) => {
            let name = null;

            if (typeof skill === "string") name = skill;
            else if (skill.label) name = skill.label;
            else if (skill.FCTM_skill_name) name = skill.FCTM_skill_name;

            return name ? name.trim().toUpperCase() : null;
          })
          .filter(Boolean);
      }

      const resSkills = await sendRequest("POST", { names: skillNames }, "/skills/ensure");

      if (!resSkills.success) {
        showAlert("Error gestionando aptitudes", "error");
        return;
      }

      const skillIds = resSkills.data;
      const configSinSkills = normalizationConfig.filter((config) => config.field !== "FCTM_skills");
      const payloadNormalizado = normalizeToApi(data, configSinSkills);

      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds
      };

      const res = await sendRequest("POST", finalPayload, "/dummy");

      if (res.success) {
        navigate("/dummy");
      } else {
        showAlert(res.message, "error");
      }
    } catch (error) {
      console.error("Error en handleSave:", error);
      showAlert("Error critico al guardar", "error");
    }
  };

  return (
    <section className="dashboard section">
      <ShowHeader
        title="Nuevo Dato Dummy"
        onBack={() => navigate("/dummy")}
      />

      <ShowEditableForm
        formTitle="Informacion F.E. Manager"
        formId="fctmForm"
        data={data}
        fields={FCTM_fields}
        isEditing={true}
        hideEditButton={true}
        onSave={handleSave}
        onCancel={() => navigate("/dummy")}
        onChange={handleChange}
      />
    </section>
  );
};

export default NewDummy;
