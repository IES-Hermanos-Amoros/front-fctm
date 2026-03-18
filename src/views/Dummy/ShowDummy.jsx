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

//Qué vamos a normalizar
const normalizationConfig = [
  {
    field: "FCTM_category",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
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