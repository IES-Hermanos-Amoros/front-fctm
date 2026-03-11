import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import ShowHeader from '../../components/Show/ShowHeader'
import ShowEditableForm from '../../components/Show/ShowEditableForm'
import useEnumStore from '../../store/enumStore'

const NewJobOffer = () => {
  const navigate = useNavigate()

  // ENUM STORE 
  //const cargarEnums = useEnumStore((state) => state.cargarEnums)
  const enums = useEnumStore((state) => state.enums);
  const getEnumArray = useEnumStore((state) => state.getEnumArray)
  //const enums = useEnumStore((state) => state.enums) 

  /*useEffect(() => {
    cargarEnums()
  }, [])*/

  // === ENUM REAL DEL BACKEND ===
  /*const jobStatusOptions = getEnumArray("JOB_STATUS")?.map(item => ({
    _id: item,
    nombre: item
  })) || []*/
   // Los datos ya están ahí o llegarán en cuanto App.jsx termine la petición
  const jobStatusOptions = useMemo(() => {
    const statusArray = getEnumArray("JOB_STATUS");
    console.log("Status Array en NewJobOffer:", statusArray); // Verás como primero es [] y luego llega con datos
    
    return statusArray.map(item => ({
      _id: item,
      nombre: item
    }));
  }, [enums, getEnumArray]);

  // === CAMPOS DEL FORMULARIO ===
  const jobOfferFields = [
    { key: 'FCTM_job_title', label: 'Título de la oferta', type: 'text', required:true },
    { key: 'FCTM_job_description', label: 'Descripción', type: 'textarea', required:true },
    { key: 'FCTM_job_requirements', label: 'Requisitos', type: 'textarea' },
    { key: 'FCTM_job_start_date', label: 'Fecha de inicio', type: 'date', required:true },
    { key: 'FCTM_job_end_date', label: 'Fecha de cierre', type: 'date' },
    { key: 'FCTM_job_observations', label: 'Observaciones', type: 'textarea' },
    { key: 'FCTM_job_salary', label: 'Salario', type: 'text' },

    // === ENUM DINÁMICO ===
    {
      key: 'FCTM_job_status',
      label: 'Estado',
      type: 'select',
      options: jobStatusOptions,
      optionValue: '_id',
      optionLabel: 'nombre',
    },
  ]
  const location = useLocation()
  const companyId = location.state?.companyId || null
  const returnPath = companyId ? `/companies/${companyId}` : '/joboffers'

  const today = new Date().toISOString().split("T")[0]

  const [data, setData] = useState({
    FCTM_job_title: '',
    FCTM_job_description: '',
    FCTM_job_requirements: '',
    FCTM_job_start_date: today,
    FCTM_job_end_date: '',
    FCTM_job_observations: '',
    FCTM_job_salary: '',
    FCTM_job_status: 'ACTIVA',
  })

  const handleChange = (field, value) => {
    if (field === 'FCTM_job_salary') {
      if (value === '' || /^[\d.,]+$/.test(value)) {
        setData(prev => ({ ...prev, [field]: value }))
      }
    } else {
      setData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    if (
      !data.FCTM_job_title ||
      !data.FCTM_job_description ||
      !data.FCTM_job_start_date ||
      !data.FCTM_job_status
    ) {
      showAlert('Por favor, completa todos los campos obligatorios.', 'error')
      return
    }

    if (data.FCTM_job_salary && !/^[\d.,]+$/.test(data.FCTM_job_salary)) {
      showAlert('El salario solo puede contener números, comas y puntos.', 'error')
      return
    }

    //const res = await sendRequest('POST', data, '/joboffers')
    const payload = companyId ? { ...data, companyId } : data
    const res = await sendRequest('POST', payload, '/joboffers')
    if (res.success) {
      navigate(returnPath)
    } else {
      showAlert(res.message, 'error')
    }
  }

  return (
    <section className="dashboard section">
      <ShowHeader
        title="Nueva Oferta de Trabajo"
        onBack={() => navigate(returnPath)}
      />

      <ShowEditableForm
        formTitle="Alta de Oferta de Trabajo"
        formId="jobOfferForm"
        data={data}
        fields={jobOfferFields}
        isEditing={true}
        hideEditButton={true}
        onSave={handleSave}
        onCancel={() => navigate(returnPath)}
        onChange={handleChange}
      />
    </section>
  )
}

export default NewJobOffer
