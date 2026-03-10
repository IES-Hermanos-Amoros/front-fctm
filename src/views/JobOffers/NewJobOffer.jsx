import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import ShowHeader from '../../components/Show/ShowHeader'
import ShowEditableForm from '../../components/Show/ShowEditableForm'
import useEnumStore from '../../store/enumStore'

const NewJobOffer = () => {
  const navigate = useNavigate()

  // ENUM STORE 
  const cargarEnums = useEnumStore((state) => state.cargarEnums)
  const getEnumArray = useEnumStore((state) => state.getEnumArray)
  const enums = useEnumStore((state) => state.enums) 

  useEffect(() => {
    cargarEnums()
  }, [])

  // === ENUM REAL DEL BACKEND ===
  const jobStatusOptions = getEnumArray("JOB_STATUS")?.map(item => ({
    _id: item,
    nombre: item
  })) || []

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

  const [data, setData] = useState({
    FCTM_job_title: '',
    FCTM_job_description: '',
    FCTM_job_requirements: '',
    FCTM_job_start_date: '',
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
      !data.FCTM_job_end_date ||
      !data.FCTM_job_status
    ) {
      showAlert('Por favor, completa todos los campos obligatorios.', 'error')
      return
    }

    if (data.FCTM_job_salary && !/^[\d.,]+$/.test(data.FCTM_job_salary)) {
      showAlert('El salario solo puede contener números, comas y puntos.', 'error')
      return
    }

    const res = await sendRequest('POST', data, '/joboffers')
    if (res.success) {
      navigate('/joboffers')
    } else {
      showAlert(res.message, 'error')
    }
  }

  return (
    <section className="dashboard section">
      <ShowHeader
        title="Nueva Oferta de Trabajo"
        onBack={() => navigate('/joboffers')}
      />

      <ShowEditableForm
        formTitle="Alta de Oferta de Trabajo"
        formId="jobOfferForm"
        data={data}
        fields={jobOfferFields}
        isEditing={true}
        hideEditButton={true}
        onSave={handleSave}
        onCancel={() => navigate('/joboffers')}
        onChange={handleChange}
      />
    </section>
  )
}

export default NewJobOffer
