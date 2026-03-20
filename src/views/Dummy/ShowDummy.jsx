import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert,normalizeFromApi, normalizeToApi } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import SectionChangePassword from "../../components/User/SectionChangePassword";


//TEMPORAL hasta el uso de Zustand (y creación de maestros en el API)
const dummyTypes = [
  { "_id": "TEXTO", "nombre": "TEXTO" },
  { "_id": "NUMERO", "nombre": "NUMERO" },
  { "_id": "BOOLEANO", "nombre": "BOOLEANO" },
  { "_id": "OTRO", "nombre": "OTRO" }
]

//TEMPORAL - PENDIENTE DE ZUSTAND Y MAESTROS EN API
// Ejemplo de categorías para el multiselect
const categoryOptions = [
  {
    _id: "69a82074499df1aec1d2477e",
    FCTM_category_name: "AGRO-JARDINERIA Y COMPOSICIONES FLORALES"
  },
  {
    _id: "69a82074499df1aec1d2477f",
    FCTM_category_name: "DESARROLLO DE APLICACIONES WEB"
  },
  {
    _id: "69a82074499df1aec1d24780",
    FCTM_category_name: "EDUCACIÓN INFANTIL"
  },
  {
    _id: "69a82074499df1aec1d24781",
    FCTM_category_name: "GESTIÓN FORESTAL Y DEL MEDIO NATURAL"
  },
  {
    _id: "69a82074499df1aec1d24782",
    FCTM_category_name: "INTEGRACIÓN SOCIAL"
  },
  {
    _id: "69a82074499df1aec1d24783",
    FCTM_category_name: "PRODUCCIÓN AGROECOLÓGICA"
  },
  {
    _id: "69a82074499df1aec1d24784",
    FCTM_category_name: "SISTEMAS MICROINFORMÁTICOS Y REDES"
  }
];

const skillOptions = [
  { _id: "69bd6bb2e1aa8f195c71c305", FCTM_skill_name: "ADAPTABILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c31d", FCTM_skill_name: "ADMINISTRACIÓN DE SISTEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c339", FCTM_skill_name: "ADOBE ILLUSTRATOR" },
  { _id: "69bd6bb2e1aa8f195c71c338", FCTM_skill_name: "ADOBE PHOTOSHOP" },
  { _id: "69bd6bb2e1aa8f195c71c341", FCTM_skill_name: "AGRICULTURA ECOLÓGICA" },
  { _id: "69bd6bb2e1aa8f195c71c320", FCTM_skill_name: "ANGULAR" },
  { _id: "69bd6bb2e1aa8f195c71c32b", FCTM_skill_name: "ANÁLISIS DE DATOS" },
  { _id: "69bd6bb2e1aa8f195c71c32e", FCTM_skill_name: "ATENCIÓN AL CLIENTE" },
  { _id: "69bd6bb2e1aa8f195c71c322", FCTM_skill_name: "AWS" },
  { _id: "69bd6bb2e1aa8f195c71c323", FCTM_skill_name: "AZURE" },
  { _id: "69bd6bb2e1aa8f195c71c344", FCTM_skill_name: "BOTÁNICA" },
  { _id: "69bd6bb2e1aa8f195c71c325", FCTM_skill_name: "C#" },
  { _id: "69bd6bb2e1aa8f195c71c326", FCTM_skill_name: "C++" },
  { _id: "69bd6bb2e1aa8f195c71c316", FCTM_skill_name: "CIBERSEGURIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c315", FCTM_skill_name: "CLOUD COMPUTING" },
  { _id: "69bd6bb2e1aa8f195c71c301", FCTM_skill_name: "COMUNICACIÓN EFECTIVA" },
  { _id: "69bd6bb2e1aa8f195c71c332", FCTM_skill_name: "CONTENT MARKETING" },
  { _id: "69bd6bb2e1aa8f195c71c345", FCTM_skill_name: "CONTROL DE PLAGAS" },
  { _id: "69bd6bb2e1aa8f195c71c308", FCTM_skill_name: "CREATIVIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c310", FCTM_skill_name: "CSS3" },
  { _id: "69bd6bb2e1aa8f195c71c329", FCTM_skill_name: "DESARROLLO DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c30b", FCTM_skill_name: "DESARROLLO WEB" },
  { _id: "69bd6bb2e1aa8f195c71c335", FCTM_skill_name: "DISEÑO GRÁFICO" },
  { _id: "69bd6bb2e1aa8f195c71c33b", FCTM_skill_name: "DOCENCIA" },
  { _id: "69bd6bb2e1aa8f195c71c318", FCTM_skill_name: "DOCKER" },
  { _id: "69bd6bb2e1aa8f195c71c334", FCTM_skill_name: "E-COMMERCE" },
  { _id: "69bd6bb2e1aa8f195c71c33c", FCTM_skill_name: "E-LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c33a", FCTM_skill_name: "EDICIÓN DE VÍDEO" },
  { _id: "69bd6bb2e1aa8f195c71c30a", FCTM_skill_name: "EMPATÍA" },
  { _id: "69bd6bb2e1aa8f195c71c328", FCTM_skill_name: "ESTRATEGIA DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c337", FCTM_skill_name: "FIGMA" },
  { _id: "69bd6bb2e1aa8f195c71c343", FCTM_skill_name: "GESTIÓN AMBIENTAL" },
  { _id: "69bd6bb2e1aa8f195c71c327", FCTM_skill_name: "GESTIÓN DE PROYECTOS" },
  { _id: "69bd6bb2e1aa8f195c71c303", FCTM_skill_name: "GESTIÓN DEL TIEMPO" },
  { _id: "69bd6bb2e1aa8f195c71c347", FCTM_skill_name: "GESTIÓN FORESTAL" },
  { _id: "69bd6bb2e1aa8f195c71c317", FCTM_skill_name: "GIT" },
  { _id: "69bd6bb2e1aa8f195c71c333", FCTM_skill_name: "GOOGLE ANALYTICS" },
  { _id: "69bd6bb2e1aa8f195c71c309", FCTM_skill_name: "HABLAR EN PÚBLICO" },
  { _id: "69bd6bb2e1aa8f195c71c30f", FCTM_skill_name: "HTML5" },
  { _id: "69bd6bb2e1aa8f195c71c33e", FCTM_skill_name: "INTEGRACIÓN SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c31a", FCTM_skill_name: "INTELIGENCIA ARTIFICIAL" },
  { _id: "69bd6bb2e1aa8f195c71c307", FCTM_skill_name: "INTELIGENCIA EMOCIONAL" },
  { _id: "69bd6bb2e1aa8f195c71c33d", FCTM_skill_name: "INTERVENCIÓN SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c348", FCTM_skill_name: "JARDINERÍA" },
  { _id: "69bd6bb2e1aa8f195c71c30e", FCTM_skill_name: "JAVA" },
  { _id: "69bd6bb2e1aa8f195c71c30c", FCTM_skill_name: "JAVASCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c319", FCTM_skill_name: "KUBERNETES" },
  { _id: "69bd6bb2e1aa8f195c71c2ff", FCTM_skill_name: "LIDERAZGO" },
  { _id: "69bd6bb2e1aa8f195c71c31b", FCTM_skill_name: "MACHINE LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c32f", FCTM_skill_name: "MARKETING DIGITAL" },
  { _id: "69bd6bb2e1aa8f195c71c306", FCTM_skill_name: "NEGOCIACIÓN" },
  { _id: "69bd6bb2e1aa8f195c71c312", FCTM_skill_name: "NODE.JS" },
  { _id: "69bd6bb2e1aa8f195c71c314", FCTM_skill_name: "NOSQL" },
  { _id: "69bd6bb2e1aa8f195c71c340", FCTM_skill_name: "ORIENTACIÓN LABORAL" },
  { _id: "69bd6bb2e1aa8f195c71c342", FCTM_skill_name: "PAISAJISMO" },
  { _id: "69bd6bb2e1aa8f195c71c304", FCTM_skill_name: "PENSAMIENTO CRÍTICO" },
  { _id: "69bd6bb2e1aa8f195c71c324", FCTM_skill_name: "PHP" },
  { _id: "69bd6bb2e1aa8f195c71c32a", FCTM_skill_name: "PLANIFICACIÓN ESTRATÉGICA" },
  { _id: "69bd6bb2e1aa8f195c71c33f", FCTM_skill_name: "PSICOLOGÍA" },
  { _id: "69bd6bb2e1aa8f195c71c30d", FCTM_skill_name: "PYTHON" },
  { _id: "69bd6bb2e1aa8f195c71c311", FCTM_skill_name: "REACT" },
  { _id: "69bd6bb2e1aa8f195c71c32c", FCTM_skill_name: "RECURSOS HUMANOS" },
  { _id: "69bd6bb2e1aa8f195c71c31e", FCTM_skill_name: "REDES DE COMPUTADORES" },
  { _id: "69bd6bb2e1aa8f195c71c302", FCTM_skill_name: "RESOLUCIÓN DE PROBLEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c331", FCTM_skill_name: "SEM" },
  { _id: "69bd6bb2e1aa8f195c71c330", FCTM_skill_name: "SEO" },
  { _id: "69bd6bb2e1aa8f195c71c31c", FCTM_skill_name: "SOPORTE TÉCNICO" },
  { _id: "69bd6bb2e1aa8f195c71c346", FCTM_skill_name: "SOSTENIBILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c313", FCTM_skill_name: "SQL" },
  { _id: "69bd6bb2e1aa8f195c71c300", FCTM_skill_name: "TRABAJO EN EQUIPO" },
  { _id: "69bd6bb2e1aa8f195c71c31f", FCTM_skill_name: "TYPESCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c336", FCTM_skill_name: "UI/UX" },
  { _id: "69bd6bb2e1aa8f195c71c32d", FCTM_skill_name: "VENTAS" },
  { _id: "69bd6bb2e1aa8f195c71c321", FCTM_skill_name: "VUE.JS" }
];


//Qué vamos a normalizar
const normalizationConfig = [
  {
    field: "FCTM_category",
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

const SAO_fields = [
    { key: "SAO_id", label: "SAO ID", type: "text"},
    { key: "SAO_username", label: "Username:", type: "text" },
    { key: "SAO_email", label: "Email", type: "email" }
  ]

const FCTM_fields = [
  { key: "FCTM_dummy_observations", label: "Observaciones", type: "textarea"},
  { key: "FCTM_dummy_other_contact", label: "Otro contacto", type:"text" },
  { key: "FCTM_dummy_description", label: "Descripción", type:"text" },
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
    label: "Categorías",
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
  }

]

const columnasDocuments = [
        {   key:"_id", encabezado: "#"} ,
        {   key:"FCTM_document_name", encabezado: "Nombre"} ,
        {   key:"FCTM_document_url", encabezado: "Ruta"},
        {   key:"FCTM_document_description", encabezado: "Descripción"},
        {   key:"FCTM_document_type", encabezado: "Tipo Doc."}        
    ]

const ShowDummy = () => {
  const { id } = useParams(); // ID obtenido desde la URL /dummy/:id
  const navigate = useNavigate();

  const [data, setData] = useState(null); // Datos del dummy cargado desde API
  const [loading, setLoading] = useState(true); // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false); // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null);

  // Cargar el dummy por ID
  const fetchDummy = useCallback(async () => {
    setLoading(true);

    const res = await sendRequest("GET", null, `/dummy/${id}`);

    if (res.success) {

      const normalized = normalizeFromApi(res.data, normalizationConfig);

      setData(normalized);
      setOriginalData(normalized); // snapshot original
      console.log(normalized)
    } else {
      console.error("Error al cargar el dummy:", res.message);
    }

    setLoading(false);
  }, [id]);

  // Guardar cambios FCTM_
  const handleSave = async () => {

    const payload = normalizeToApi(data, normalizationConfig);

    const res = await sendRequest("PUT", payload, `/dummy/${id}`);

    if (res.success) {
      const normalized = normalizeFromApi(res.data, normalizationConfig);
      setData(normalized);
      setOriginalData(normalized);
      setIsEditing(false);
    } else {
      showAlert(res.message,"error");
    }
  };

  // Actualizar campos FCTM_ en estado local
  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setData(originalData); // restauramos valores
    setIsEditing(false);
  };

  useEffect(() => {
    fetchDummy();
  }, [fetchDummy]);

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>No se encontraron datos</p>;

  return (
    <section className="dashboard section">

      <ShowHeader 
        title={`Ficha de ${data?.SAO_username || 'Dummy'}`} 
        onBack={() => navigate('/dummy')} 
      />

      <ShowEditableForm
        formTitle="Información de SAO"
        formId="saoForm" 
        data={data} 
        fields={SAO_fields}
        hideEditButton={true}
      />

      <ShowEditableForm
        formTitle="Datos Adicionales"
        formId="fctmForm"
        data={data}
        fields={FCTM_fields}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      {/* --- NUEVA SECCIÓN DE CONTRASEÑA --- */}
      <SectionChangePassword 
        isEditing={isEditing} 
        onChange={( pwdData) => {
          // Aquí podríamos manejar el estado de la contraseña o enviarlo directamente al guardar
          // Por ejemplo, podríamos almacenarlo en un estado local y luego incluirlo en el payload de handleSave
          console.log("Datos de contraseña modificados:", pwdData);
        }}
      />

      <ListCRUD 
          title="Datos Dummy Relacionados"
          datos={data.FCTM_documents}
          columnas={columnasDocuments}          
      >
            {/* Children */}
                <button
              className="btn btn-success"
              onClick={() => navigate('/documents/new')}
            >
              Añadir Documento
            </button>
      </ListCRUD>
    </section>
  );
};

export default ShowDummy;