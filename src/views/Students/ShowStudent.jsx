import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendRequest, showAlert } from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowReadonlyForm from "../../components/Show/ShowReadonlyForm";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";

const ShowStudent = () => {

    //CAROLINA
    const { id } = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [isEditing,setIsEditing] = useState(false)
    const [originalData,setOriginalData] = useState(null)

    const fetchStudent = useCallback(async () => {
      setLoading(true)
      
      const res = await sendRequest("GET", null, `/students/${id}`)

      if(res.success) {
        setData(res.data)
        setOriginalData(res.data)
        console.log(res.data)
      } else {
        console.error("Error al cargar el estudiante: ", res.message)
      }

      setLoading(false)
    }, [id])

    //MIRIAM
  return (
    <div>
        
    </div>
  )
}

export default ShowStudent