import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";

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
        data={data}
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