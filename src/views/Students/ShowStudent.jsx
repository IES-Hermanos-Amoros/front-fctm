import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

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

    // Cargar el estudiante por ID
    const fetchStudent = useCallback(async () => {
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
        setData(transformedData)
        setOriginalData(res.data)
        console.log(res.data)
      } else {
        console.error("Error al cargar el estudiante: ", res.message)
      }

      setLoading(false)
    }, [id])

    // Guardar cambios FCTM_
    const handleSave = async () => {
      const payload = {
        FCTM_student_observations: data.FCTM_student_observations,
        FCTM_student_other_contact: data.FCTM_student_other_contact,
        FCTM_student_openToWork: data.FCTM_student_openToWork === "true" ? true : false
      }

      const res = await sendRequest("PATCH", payload, `/students/${id}`);

      if (res.success) {
        setData(prev => ({ ...prev, ...res.data }));
        setOriginalData(prev => ({ ...prev, ...res.data }));
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

    //AINHOA
    const handleFileUpload = async () => {
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

    // AITANA
    const handleDeleteDocument = async (docId) => {
      // Usamos el showAlert que ya tenéis importado para el confirm
      const result = await showAlert("¿Estás seguro de que quieres eliminar este CV?", "question", {
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (result.isConfirmed) {
        const res = await sendRequest("DELETE", null, `/students/${id}/documents/${docId}`);
        if (res.success) {
          showAlert("Documento eliminado correctamente", "success");
          fetchStudent(); // Recargamos los datos para que desaparezca de la tabla
        } else {
          showAlert(res.message, "error");
        }
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
          )}

          {/* SECCIÓN DE AITANA: Tabla de documentos */}
          <div className="mt-4 p-4 bg-white border rounded shadow-sm">
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
                          <td>{new Date(doc.FCTM_inserted_date).toLocaleDateString()}</td> {/* Fecha antes */}
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
          </div>
        </section>
    </div>
  )
}

export default ShowStudent