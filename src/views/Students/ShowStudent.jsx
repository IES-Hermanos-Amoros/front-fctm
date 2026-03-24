import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, confirmation, showAlert, formatDateDDMMYYYYHHmm, getBackendHost, normalizeFromApi, normalizeToApi } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";


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

const normalizationConfig = [
  {
    field: "FCTM_skills",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name",
    type: "multi"
  }
];

//CAROLINA
const FCTM_fields = [
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
    key: "FCTM_skills",
    label: "Aptitudes/Tecnologías",
    type: "select-multi-creatable",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name"
  }
]

const ShowStudent = () => {

    //CAROLINA
    const { id } = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [isEditing,setIsEditing] = useState(false)
    const [originalData,setOriginalData] = useState(null)

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

    // Cargar el estudiante por ID
    const fetchStudent = useCallback(async () => {
      setLoading(true)
      
      const res = await sendRequest("GET", null, `/students/${id}`)

      if(res.success) {
          const formatDateForInput = (isoDate) => {
            if (!isoDate) return ""
            return isoDate.split("T")[0]
          }
          
          // Normalizamos las habilidades (skills) si vienen del API
          const normalizedData = normalizeFromApi(res.data, []); // Solo skills se quedan como están
          
          const transformedData = {
            ...normalizedData,
            FCTM_student_openToWork: String(res.data.FCTM_student_openToWork),
            SAO_registryDate: formatDateForInput(res.data.SAO_registryDate),
            SAO_accessDate: formatDateForInput(res.data.SAO_accessDate)
          }
        setData(transformedData)
        setOriginalData(transformedData)
        console.log(res.data)
      } else {
        console.error("Error al cargar el estudiante: ", res.message)
      }

      setLoading(false)
    }, [id])

    // Guardar cambios FCTM_
    const handleSave = async () => {
      try {
        // A. Asegurar las skills en el backend
        let skillNames = [];
        if (data.FCTM_skills) {
          skillNames = data.FCTM_skills.map(s => {
            let name = null;
            if (typeof s === "string") name = s;
            else if (s.label) name = s.label;
            else if (s.FCTM_skill_name) name = s.FCTM_skill_name;
            return name ? name.trim().toUpperCase() : null;
          }).filter(Boolean);
        }

        const resSkills = await sendRequest("POST", { names: skillNames }, "/skills/ensure");
        if (!resSkills.success) return showAlert("Error en habilidades", "error");

        const skillIds = resSkills.data;

        // B. Preparar payload final
        const payload = {
          FCTM_student_observations: data.FCTM_student_observations,
          FCTM_student_other_contact: data.FCTM_student_other_contact,
          FCTM_student_openToWork: data.FCTM_student_openToWork === "true" ? true : false,
          FCTM_skills: skillIds
        }

        const res = await sendRequest("PATCH", payload, `/students/${id}`);

        if (res.success) {
          setData(prev => ({ ...prev, ...res.data }));
          setOriginalData(prev => ({ ...prev, ...res.data }));
          setIsEditing(false);
          showAlert("Estudiante actualizado", "success");
          fetchStudent(); // Recargamos para normalizar
        } else {
          showAlert(res.message,"error");
        }
      } catch (err) {
        console.error(err);
        showAlert("Error crítico", "error");
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

    //AINHOA
    const handleFileUpload__OLD = async () => {
      if (!selectedFile) return showAlert("Selecciona un archivo", "warning");

      const formData = new FormData();
      // El backend espera 'documents' para el array de archivos
      formData.append("documents", selectedFile); 

      // El 'true' al final es vital para que sendRequest envíe el archivo correctamente
      const res = await sendRequest("POST", formData, `/students/${id}/documents`, true);

      if (res.success) {
        showAlert("CV subido con éxito", "success");
        setSelectedFile(null);
        fetchStudent(); 
      }
    };

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

    //mostrar solo los que existen (y los de FCTM_ que queremos gestionar)
    const filteredFCTMFields = FCTM_fields.filter(field => field.key in data || field.key === "FCTM_skills").map(field => {
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