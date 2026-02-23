import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendRequest, showAlert } from '../../utils/functions'
import ShowHeader from '../../components/Show/ShowHeader'
import ShowEditableForm from '../../components/Show/ShowEditableForm'

const jobStatusOptions = [
  { _id: 'ACTIVA', nombre: 'ACTIVA' },
  { _id: 'CERRADA', nombre: 'CERRADA' },
  { _id: 'EN PROGRESO', nombre: 'EN PROGRESO' },
]

const jobOfferFields = [
  { key: 'FCTM_job_title', label: 'Título de la oferta*', type: 'text' },
  { key: 'FCTM_job_description', label: 'Descripción*', type: 'textarea' },
  { key: 'FCTM_job_requirements', label: 'Requisitos', type: 'textarea' },
  { key: 'FCTM_job_start_date', label: 'Fecha de inicio*', type: 'date' },
  { key: 'FCTM_job_end_date', label: 'Fecha de cierre*', type: 'date' },
  { key: 'FCTM_job_observations', label: 'Observaciones', type: 'textarea' },
  { key: 'FCTM_job_salary', label: 'Salario', type: 'text' },
  {
    key: 'FCTM_job_status',
    label: 'Estado*',
    type: 'select',
    options: jobStatusOptions,
    optionValue: '_id',
    optionLabel: 'nombre',
  },
]

const NewJobOffer = () => {
  const navigate = useNavigate()
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
    // Si el campo es salario, permitir números, comas y puntos
    if (field === 'FCTM_job_salary') {
      // Permitir vacío o solo números, comas y puntos
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
    // Validar salario si está informado
    if (data.FCTM_job_salary && !/^[\d.,]+$/.test(data.FCTM_job_salary)) {
      showAlert(
        'El salario solo puede contener números, comas y puntos.',
        'error'
      )
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
