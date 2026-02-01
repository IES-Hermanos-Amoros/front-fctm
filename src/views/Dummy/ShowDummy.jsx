import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowReadonlyForm from "../../components/Show/ShowReadonlyForm";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";

const columnasDocuments = [
        {   key:"_id", encabezado: "#"} ,
        {   key:"FCTM_document_name", encabezado: "Nombre"} ,
        {   key:"FCTM_document_url", encabezado: "Ruta"},
        {   key:"FCTM_document_description", encabezado: "Descripción"},
        {   key:"FCTM_document_type", encabezado: "Tipo Doc."}        
    ]

const ShowDummy = () => {
  const { id } = useParams(); // ID obtenido desde la URL /dummy/:id
  const navigate = useNavigate();

  const [data, setData] = useState(null); // Datos del dummy cargado desde API
  const [loading, setLoading] = useState(true); // Controla estado de carga
  const [isEditing, setIsEditing] = useState(false); // Modo SHOW / EDIT
  const [originalData, setOriginalData] = useState(null);

  // Cargar el dummy por ID
  const fetchDummy = useCallback(async () => {
    setLoading(true);

    const res = await sendRequest("GET", null, `/dummy/${id}`);

    if (res.success) {
      setData(res.data);
      setOriginalData(res.data); // snapshot original
      console.log(res.data)
    } else {
      console.error("Error al cargar el dummy:", res.message);
    }

    setLoading(false);
  }, [id]);

  // Guardar cambios FCTM_
  const handleSave = async () => {
    const res = await sendRequest("PUT", data, `/dummy/${id}`);

    if (res.success) {
      setData(res.data);
      setOriginalData(res.data);
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
    }));
  };

  const handleCancel = () => {
    setData(originalData); // restauramos valores
    setIsEditing(false);
  };

  useEffect(() => {
    fetchDummy();
  }, [fetchDummy]);

  if (loading) return <p>Cargando datos...</p>;
  if (!data) return <p>No se encontraron datos</p>;

  return (
    <section className="dashboard section">

      <ShowHeader 
        title={`Ficha de ${data?.SAO_username || 'Dummy'}`} 
        onBack={() => navigate('/dummy')} 
      />

      <ShowReadonlyForm data={data} />

      <ShowEditableForm
        data={data}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />

      <ListCRUD 
          title="Datos Dummy Relacionados"
          datos={data.FCTM_documents}
          columnas={columnasDocuments}          
      >
            {/* Children */}
                <button
              className="btn btn-success"
              onClick={() => navigate('/documents/new')}
            >
              Añadir Documento
            </button>
      </ListCRUD>
    </section>
  );
};

export default ShowDummy;