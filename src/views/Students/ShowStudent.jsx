import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest,confirmation, showAlert,formatDateDDMMYYYYHHmm,getBackendHost,normalizeFromApi, normalizeToApi } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";
import UserAvatarUploader from "../../components/User/UserAvatarUploader";
import useSkillStore from "../../store/skillStore";

const categoryOptions = [
  { _id: "69a82074499df1aec1d2477e", FCTM_category_name: "AGRO-JARDINERIA Y COMPOSICIONES FLORALES" },
  { _id: "69a82074499df1aec1d2477f", FCTM_category_name: "DESARROLLO DE APLICACIONES WEB" },
  { _id: "69a82074499df1aec1d24780", FCTM_category_name: "EDUCACIÓN INFANTIL" },
  { _id: "69a82074499df1aec1d24781", FCTM_category_name: "GESTIÓN FORESTAL Y DEL MEDIO NATURAL" },
  { _id: "69a82074499df1aec1d24782", FCTM_category_name: "INTEGRACIÓN SOCIAL" },
  { _id: "69a82074499df1aec1d24783", FCTM_category_name: "PRODUCCIÓN AGROECOLÓGICA" },
  { _id: "69a82074499df1aec1d24784", FCTM_category_name: "SISTEMAS MICROINFORMÁTICOS Y REDES" }
];

const mergeSkillOptions = (storeSkills = [], entitySkills = []) => {
  const merged = [...storeSkills];
  const seen = new Set(storeSkills.map(skill => skill._id));

  entitySkills.forEach(skill => {
    if (
      skill &&
      typeof skill === "object" &&
      skill._id &&
      skill.FCTM_skill_name &&
      !seen.has(skill._id)
    ) {
      merged.push(skill);
      seen.add(skill._id);
    }
  });

  return merged;
};

const buildNormalizationConfig = (skillOptions) => [
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

//MIRIAM
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


//CAROLINA
const buildFCTMFields = (skillOptions) => [
  { key: "FCTM_student_observations", label: "Observaciones", type: "text"},
  { key: "FCTM_student_other_contact", label: "Contacto Alternativo", type: "text"},
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
    label: "Aptitudes/Tecnologías",
    type: "select-multi", 
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  }
]

const ShowStudent = () => {

    //CAROLINA
    const { id } = useParams()
    const navigate = useNavigate()
    const skillOptions = useSkillStore((state) => state.skills);
    const cargarSkills = useSkillStore((state) => state.cargarSkills);
    const normalizationConfig = buildNormalizationConfig(skillOptions);
    const FCTM_fields = buildFCTMFields(skillOptions);

    const [data, setData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [isEditing,setIsEditing] = useState(false)
    const [originalData,setOriginalData] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState("");
    const hostAPI = getBackendHost()

    useEffect(() => {
      cargarSkills();
    }, [cargarSkills]);

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
              <i className="bi bi-download"></i> {/* Icono de descarga */}
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
        const formatDateForInput = (isoDate) => {
          if (!isoDate) return "";
          return isoDate.split("T")[0];
        };

        // 1. Preparación inicial de campos simples
        const baseData = {
          ...res.data,
          FCTM_student_openToWork: String(res.data.FCTM_student_openToWork),
          SAO_registryDate: formatDateForInput(res.data.SAO_registryDate),
          SAO_accessDate: formatDateForInput(res.data.SAO_accessDate)
        };

        const responseNormalizationConfig = buildNormalizationConfig(
          mergeSkillOptions(skillOptions, res.data.FCTM_skills || [])
        );

        // 2. Normalización de campos múltiples (Categories y Skills)
        // Esto convierte los IDs que vienen del backend en los objetos que necesita el componente para pintar los CHIPS
        const dataNormalizada = normalizeFromApi(baseData, responseNormalizationConfig);

        setData(dataNormalizada);
        setOriginalData(dataNormalizada);

        // 3. Gestión del Avatar
        let avatarUrl = "";
        if (res.data?.FCTM_documents?.length) {
          const avatarDoc = res.data.FCTM_documents.find(
            d => d.FCTM_document_type === "AVATAR"
          );
          if (avatarDoc?.FCTM_document_url) {
            avatarUrl = avatarDoc.FCTM_document_url;
          }
        }
        setAvatarUrl(avatarUrl);

      } else {
        console.error("Error al cargar el estudiante: ", res.message);
      }

      setLoading(false);
    }, [id, skillOptions]);

    // Cargar el estudiante por ID
    const fetchStudentOLD = useCallback(async () => {
      setLoading(true)
      
      const res = await sendRequest("GET", null, `/students/${id}`)

      if(res.success) {
          const formatDateForInput = (isoDate) => {
            if (!isoDate) return ""
            return isoDate.split("T")[0]
          }
          const transformedData = {
            ...res.data,
            FCTM_student_openToWork: String(res.data.FCTM_student_openToWork),
            SAO_registryDate: formatDateForInput(res.data.SAO_registryDate),
            SAO_accessDate: formatDateForInput(res.data.SAO_accessDate)
          }
        
        const configSoloCategorias = normalizationConfig.filter(c => c.field === "FCTM_category");
        const dataNormalizada = normalizeFromApi(transformedData, configSoloCategorias);


        setData(transformedData)
        setOriginalData(transformedData)
        //setAvatarUrl(hostAPI + res.datºa?.FCTM_documents[0]?.FCTM_document_url || "");
        let avatarUrl = "";
        if (res.data?.FCTM_documents?.length) {
          const avatarDoc = res.data.FCTM_documents.find(
            d => d.FCTM_document_type === "AVATAR"
          );
          if (avatarDoc?.FCTM_document_url) {
            avatarUrl = avatarDoc.FCTM_document_url;
          }
        }
        setAvatarUrl(avatarUrl);

      } else {
        console.error("Error al cargar el estudiante: ", res.message)
      }

      setLoading(false)
    }, [id, normalizationConfig])

    // Guardar cambios FCTM_
    const handleSave = async () => {
      /*const payload = {
        FCTM_student_observations: data.FCTM_student_observations,
        FCTM_student_other_contact: data.FCTM_student_other_contact,
        FCTM_student_openToWork: data.FCTM_student_openToWork === "true" ? true : false
      }*/

      const payloadNormalizado = normalizeToApi(data, normalizationConfig);

      console.log("Payload a enviar: ", payloadNormalizado)
      const res = await sendRequest("PATCH", payloadNormalizado, `/students/${id}`);

      if (res.success) {
        const formatDateForInput = (isoDate) => {
          if (!isoDate) return "";
          return isoDate.split("T")[0];
        };

        const baseData = {
          ...res.data,
          FCTM_student_openToWork: String(res.data.FCTM_student_openToWork),
          SAO_registryDate: formatDateForInput(res.data.SAO_registryDate),
          SAO_accessDate: formatDateForInput(res.data.SAO_accessDate)
        };

        const responseNormalizationConfig = buildNormalizationConfig(
          mergeSkillOptions(skillOptions, res.data.FCTM_skills || [])
        );

        const dataFinal = normalizeFromApi(baseData, responseNormalizationConfig);
        setData(dataFinal);
        setOriginalData(dataFinal);
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
      }))
    }

    const handleCancel = () => {
      setData(originalData) // restauramos valores
      setIsEditing(false)
    }

    const [selectedFile, setSelectedFile] = useState(null);



    const handleFileUpload = async () => {
      if (!selectedFile) return showAlert("Selecciona un archivo", "warning");

      const formData = new FormData();
      // CAMBIO: El backend espera 'files' para el array de archivos
      formData.append("files", selectedFile); 
      
      // Agregamos metadata si la necesitas
      formData.append("type", "CURRÍCULUM VITAE");
      formData.append("userId", id);

      // CAMBIO: Usamos el endpoint correcto que tiene el middleware de multer
      const res = await sendRequest("POST", formData, `/documents/upload`);

      if (res.success) {
        showAlert("CV subido con éxito", "success");
        setSelectedFile(null);
        fetchStudent(); // Recargamos para ver el nuevo CV en la tabla
      } else {
        // Si res.message no llega, capturamos el posible error de servidor
        showAlert(res.message || "Error al subir el CV", "error");
      }
    };

    // AITANA
    const handleDeleteDocument = async (docId) => {
      // Usamos el showAlert que ya tenéis importado para el confirm
      /*const result = await showAlert("¿Estás seguro de que quieres eliminar este CV?", "question", {
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });*/
      const confirmado = await confirmation('¿Seguro que quieres eliminar este CV?')
      if (!confirmado) return

      //const res = await sendRequest("DELETE", null, `/students/${id}/documents/${docId}`);
      const res = await sendRequest('DELETE', undefined, `/documents/${docId}`)

      if (res.success) {
        const updatedDocuments = data.FCTM_documents.filter(item => item !== docId)
        const patchRes = await sendRequest(
          "PATCH",
          { FCTM_documents: updatedDocuments },
          `/students/${id}` 
        )

        if (patchRes.success) {
          showAlert('Documento eliminado y alumno actualizado', 'success')

          setData(prev => ({
            ...prev,
            FCTM_documents: updatedDocuments
          }))

          fetchStudent()
        } else {
          showAlert('Error actualizando el alumno: ' + patchRes.message, 'error')
        }

        //showAlert("Documento eliminado correctamente", "success");
        //fetchStudent(); // Recargamos los datos para que desaparezca de la tabla
      } else {
        showAlert(res.message, "error");
      }
      
    };

    useEffect(() => {
      fetchStudent()
    }, [fetchStudent])

    if (loading) return <p>Cargando datos...</p>
    if (!data) return <p>No se encontraron datos</p>

    //MIRIAM

    //mostrar solo los que existen
    const filteredFCTMFields = FCTM_fields.filter(field => field.key in data).map(field => {
      if (field.key === "FCTM_student_openToWork") {
        return {
          ...field,
          value: data[field.key] === "true" ? true : false
        }
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

          <UserAvatarUploader
            userId={id}
            avatarUrl={avatarUrl}
            onUploadSuccess={fetchStudent}
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

          {/* AINHOA: Adjuntar currículum vitae */}
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

          {data.FCTM_documents.length === 0 ? (
            <h4>Todavía no se ha adjuntado un Currículum Vitae (pulsa en "Editar" para subir tu CV)</h4>
          ) : (
            <ListCRUD 
              title="Currículums Vitae Adjuntos"
              datos={data.FCTM_documents}
              columnas={columnasDocuments}          
            />
          )}

          {/*isEditing && (
            <div className="mt-3 p-4 bg-white border rounded shadow-sm">
              <label className="form-label fw-bold">Adjuntar Currículum Vitae</label>
              <div className="d-flex gap-2">
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button 
                  type="button" 
                  className="btn-editar" 
                  onClick={handleFileUpload}
                >
                  Adjuntar CV
                </button>
              </div>
            </div>
          )*/}

          {/* SECCIÓN DE AITANA: Tabla de documentos */}
          {/*<div className="mt-4 p-4 bg-white border rounded shadow-sm">
            <h3 className="mb-3">Currículums Vitae Adjuntos</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Descarga</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.FCTM_documents && data.FCTM_documents.length > 0 ? (
                    data.FCTM_documents
                      .sort((a, b) => new Date(b.FCTM_inserted_date) - new Date(a.FCTM_inserted_date))
                      .map((doc) => (
                        <tr key={doc._id}>
                          <td>{doc.FCTM_document_name}</td>
                          <td>{doc.FCTM_document_type}</td>
                          <td>{new Date(doc.FCTM_inserted_date).toLocaleDateString()}</td>
                          <td>
                            <a href={doc.FCTM_document_url} target="_blank" rel="noreferrer" className="text-primary">
                              Descarga
                            </a>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDocument(doc._id)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No hay currículums disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>*/}
        </section>
    </div>
  )
}

export default ShowStudent
