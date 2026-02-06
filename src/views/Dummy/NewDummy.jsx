import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

//TEMPORAL hasta el uso de Zustand (y creación de maestros en el API)
const dummyTypes = [
  { "_id": "TEXTO", "nombre": "TEXTO" },
  { "_id": "NUMERO", "nombre": "NUMERO" },
  { "_id": "BOOLEANO", "nombre": "BOOLEANO" },
  { "_id": "OTRO", "nombre": "OTRO" }
]

const FCTM_fields = [
  { key: "FCTM_dummy_observations", label: "Observaciones", type: "textarea"},
  { key: "FCTM_dummy_other_contact", label: "Otro contacto", type:"text" },
  { key: "FCTM_dummy_description", label: "Descripción", type:"text" },
  {
      key: "FCTM_dummy_type",
      label: "Tipo",
      type: "select",
      options: dummyTypes,
      optionValue: "_id",
      optionLabel: "nombre"
    }
]

const NewDummy = () => {
  const navigate = useNavigate();

  // Plantilla inicial del nuevo documento
  const [data, setData] = useState({
    FCTM_dummy_observations: "",
    FCTM_dummy_other_contact: "",
    FCTM_dummy_description: "",
    FCTM_dummy_type: ""
  });

  // Actualizar campos en estado local
  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar nuevo documento
  const handleSave = async () => {
    const res = await sendRequest("POST", data, "/dummy");

    if (res.success) {
      navigate("/dummy"); // Volvemos al listado
    } else {
      showAlert(res.message,"error");
    }
  };

  return (
    <section className="dashboard section">

      <ShowHeader
        title="Nuevo Dato Dummy"
        onBack={() => navigate("/dummy")}
      />

      <ShowEditableForm
        formTitle="Información FCT Manager"
        formId="fctmForm"
        data={data}
        fields={FCTM_fields}
        isEditing={true}           // Siempre en modo edición
        hideEditButton={true}      // No tiene sentido mostrar EDITAR en NEW
        onSave={handleSave}
        onCancel={() => navigate("/dummy")}
        onChange={handleChange}
      />
    </section>
  );
};

export default NewDummy;