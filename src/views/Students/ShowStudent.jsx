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
          const transformedData = {
            ...res.data,
            FCTM_student_openToWork: String(res.data.FCTM_student_openToWork) // true/false → "true"/"false"
          };
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

        </section>
    </div>
  )
}

export default ShowStudent