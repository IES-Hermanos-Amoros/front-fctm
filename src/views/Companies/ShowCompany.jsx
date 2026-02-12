const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  };

  const handleCancel = () => {
    setData(originalData)
    setIsEditing(false)
  }

  if (loading) return <p>Cargando información...</p>
  if (!data) return <p>Empresa no encontrada.</p>

  return (
    <section>
      <ShowHeader 
        title={`Ficha de ${data?.SAO_name || 'Empresa'}`} 
        onBack={() => navigate('/companies')} 
      />

      
      <div>
        <h3>Información SAO</h3>
        <ShowReadonlyForm data={data} fields={camposSAO} />
      </div>

      <hr />

      
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


export default ShowCompany