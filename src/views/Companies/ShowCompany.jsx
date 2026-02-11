import React, { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { sendRequest, showAlert } from "../../utils/functions"

import ShowHeader from "../../components/Show/ShowHeader"
import ShowReadonlyForm from "../../components/Show/ShowReadonlyForm"
import ShowEditableForm from "../../components/Show/ShowEditableForm"
import ListCRUD from "../../components/List/ListCRUD"


const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setData(originalData)
    setIsEditing(false)
  }

  if (loading) return <p>Cargando información...</p>
  if (!data) return <p>Empresa no encontrada.</p>

  return (
    <section className="dashboard section">
      <ShowHeader 
        title={`Ficha de ${data?.SAO_name || 'Empresa'}`} 
        onBack={() => navigate('/companies')} 
      />

      
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Información SAO (Deshabilitado)</h5>
        </div>
        <div className="card-body">
          <ShowReadonlyForm data={data} fields={camposSAO} />
        </div>
      </div>

      
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Datos Adicionales FCTM</h5>
          {!isEditing && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
              EDITAR
            </button>
          )}
        </div>
        <div className="card-body">
          <ShowEditableForm
            data={data}
            isEditing={isEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleChange}
            fields={camposFCTM}
          />
        </div>
      </div>

      
      <ListCRUD 
          title="Ofertas de Trabajo Relacionadas"
          datos={data.FCTM_job_offers || []}
          columnas={columnasOfertas}          
      >
        <button
          className="btn btn-success"
          onClick={() => navigate('/offers/new', { state: { companyId: id } })}
        >
          Añadir Oferta
        </button>
      </ListCRUD>
    </section>
  )


export default ShowCompany

