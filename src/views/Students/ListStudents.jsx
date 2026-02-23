import React, { useState, useEffect } from 'react'
import { sendRequest } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import ReactTableTanstack from '../../components/ReactTableTanstack'

const ListStudents = () => {

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)

    const res = await sendRequest("GET", null, "/students/")

    setLoading(false)

    if (res.success) {
      setStudents(res.data)
    } else {
      console.error("Error al cargar alumnos:", res.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const colStudents = [
    { key: "SAO_username", encabezado: "NIA" },
    { key: "SAO_name", encabezado: "Nombre" },
    { key: "SAO_student_city", encabezado: "Localidad" },
    {
      key:"Actions", encabezado:"Acciones",
      render: (row) => (
        <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => verFicha(row._id)}
        title="Ver ficha"
      >
        <i className="bi bi-search"></i>
      </button>
        
      )
    }
  ]
//  VER ESTUDIANTE POR ID 
  function verFicha(id) {
    navigate(`/students/${id}`)
  }

  return (
    <section className='dashboard section'>

      <div className="row">
        <div className="col-12">
          {loading ? (
            <p>Cargando alumnos...</p>
          ) : (
            <ReactTableTanstack
              tableTitle='Listado de Alumnos'
              datos={students}
              columnas={colStudents}
              mobileMode="card"
              mostrarCheckBox={false}  
            />
            
          )}
        </div>
      </div>

    </section>
  )
}

export default ListStudents
