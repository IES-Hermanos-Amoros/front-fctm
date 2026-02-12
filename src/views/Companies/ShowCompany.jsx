import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowReadonlyForm from "../../components/Show/ShowReadonlyForm";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";

//  Configuración de Columnas 
const columnasOfertas = [
  { accessorKey: "FCTM_job_title", header: "Título" },
  { accessorKey: "FCTM_job_start_date", header: "Fec. Ini" },
  { accessorKey: "FCTM_job_end_date", header: "Fec. Fin" },
  { accessorKey: "FCTM_job_status", header: "Estado" },
];

// Definición de campos SAO
const camposSAO = [
  { key: "SAO_id", label: "ID Interno SAO" },
  { key: "SAO_username", label: "CIF" },
  { key: "SAO_registryDate", label: "Fecha de Registro" },
  { key: "SAO_accessDate", label: "Último Acceso" },
  { key: "SAO_name", label: "Nombre / Razón Social" },
  { key: "SAO_organization", label: "Organización / Centro" },
  { key: "SAO_group", label: "Grupo / Curso" },
  { key: "SAO_email", label: "E-mail" },
  { key: "SAO_phone", label: "Teléfono de Contacto" },
  { key: "SAO_company_FCT_Number", label: "Nº Convenio FE" },
  { key: "SAO_company_FCT_Date", label: "Fecha Convenio FE" },
  { key: "SAO_company_FPDual_Number", label: "Nº Convenio FE Intensiva" },
  { key: "SAO_company_FPDual_Date", label: "Fecha Convenio FE Intensiva" },
  { key: "SAO_company_city", label: "Localidad" },
  { key: "SAO_company_state", label: "Provincia" },
  { key: "SAO_company_address", label: "Dirección Social" },
  { key: "SAO_company_activity", label: "Actividad Económica" },
  { key: "SAO_company_nameManager", label: "Nombre del Representante / Gerente" },
  { key: "SAO_company_idManager", label: "DNI/NIE del Representante" },
  { key: "SAO_company_deedDate", label: "Fecha de Escritura" }
];

// Definición de campos FCTM 
const camposFCTM = [
  { key: "FCTM_company_category", label: "Familia Profesional", type: "text" },
  { key: "FCTM_company_openToHire", label: "Interesada en contratar", type: "checkbox" },
  { key: "FCTM_company_other_contact", label: "Otro contacto", type: "text" },
  { key: "FCTM_company_observations", label: "Observaciones", type: "textarea" },
];

const ShowCompany = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/companies/${id}`)
    if (res.success) {
      setData(res.data);
      setOriginalData(res.data);
    } else {
      showAlert("Error al cargar la empresa", "error")
    }
    setLoading(false)
  }, [id]);

  useEffect(() => {
    fetchCompany()
  }, [fetchCompany])

  const handleSave = async () => {
    const res = await sendRequest("PUT", data, `/companies/${id}`)
    if (res.success) {
      setData(res.data);
      setOriginalData(res.data);
      setIsEditing(false);
      showAlert("Empresa actualizada", "success")
    } else {
      showAlert(res.message, "error")
    }
  };
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  if (loading) return <p>Cargando información...</p>
  if (!data) return <p>Empresa no encontrada.</p>

  return (
    <section>
      <ShowHeader 
        title={`Ficha de ${data?.SAO_name || 'Empresa'}`} 
        onBack={() => navigate('/companies')} 
      />

      {/* Sección SAO: Solo lectura */}
      <div>
        <h3>Información SAO</h3>
        <ShowReadonlyForm data={data} fields={camposSAO} />
      </div>

      <hr />

      {/* Sección FCTM: Editable */}
      <div>
        <h3>Datos Adicionales FCTM</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}>EDITAR</button>
        )}
        <ShowEditableForm
          data={data}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleChange}
          fields={camposFCTM}
        />
      </div>

      <hr />

      {/* Tabla de Ofertas */}
      <ListCRUD 
          title="Ofertas de Trabajo Relacionadas"
          datos={data.FCTM_job_offers || []}
          columnas={columnasOfertas}          
      >
        <button onClick={() => navigate('/offers/new', { state: { companyId: id } })}>
          Añadir Oferta
        </button>
      </ListCRUD>
    </section>
  )
}


export default ShowCompany
