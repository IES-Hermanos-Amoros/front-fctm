import React, {useState, useEffect} from 'react'
import { sendRequest } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import "./ListDocuments.css"
import ReactTableTanstack from '../../components/ReactTableTanstack'

let documentosOLD = [
    { _id: 1,
      nombre: "Decreto 485/2025",
      ruta: "../documents/doc1.pdf",
      autor: "María",
      observaciones: "Es un documento muy bonito"
     },
     { _id: 2,
      nombre: "Ley 1111",
      ruta: "../documents/doc2.pdf",
      autor: "María",
      observaciones: "Es un documento muy bonito"
     },
     { _id: 3,
      nombre: "Currículum Pepe",
      ruta: "../documents/doc3.pdf",
      autor: "María",
      observaciones: "Es un documento muy bonito"
     }
  ]

  const colDocumentosOLD = [
        {   key:"_id", encabezado: "#"} ,
        {   key:"nombre", encabezado: "Nombre"} ,
        {   key:"ruta", encabezado: "Ruta"},
        {   key:"autor", encabezado: "Autor"},
        {   key:"observaciones", encabezado: "Observaciones"}        
    ]


const ListDocuments = () => {

  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextId, setNextId] = useState(4); // Para simular ID incremental
  const navigate = useNavigate();




     const fetchData = async () => {            
    
            setLoading(true);            
                
            const res = await sendRequest("GET", null, "/documents/");
    
            setLoading(false);
    
            if (res.success) {
                setDocumentos(res.data);                    
    
            } else {                
                console.error("Error al cargar datos:", res.message);
            }
        };

    /*const getDocumentsFetch = async() => {
         setLoading(true);
        await fetch('http://localhost:4000/documents')
          .then(res => res.json())
          .then(data => {
              setDocumentos(data);
          })
          .catch(e => console.log(e.message))
          .finally(()=>{
            setLoading(false);
          })
    }*/

    // Simular GET
    const getDocuments = () => {
      setLoading(true);
      setTimeout(() => {
        setDocumentos(documentosOLD);
        setLoading(false);
      }, 500);
    };


    // Simular POST
  const crearDocumento = () => {
    const nuevo = {
      _id: nextId,
      nombre: `Documento ${nextId}`,
      ruta: `../documents/doc${nextId}.pdf`
    };
    const nuevosDocs = [...documentosOLD, nuevo];
    documentosOLD = nuevosDocs; // Persistimos en memoria
    setDocumentos(nuevosDocs);
    setNextId(prev => prev + 1);
  };

  // Simular DELETE
  const eliminarDocumento = (id) => {
    const confirmado = window.confirm("¿Estás seguro?");
    if (confirmado) {
      const nuevosDocs = documentosOLD.filter(doc => doc._id !== id);
      documentosOLD = nuevosDocs; //Persistimos en memoria
      setDocumentos(nuevosDocs);
    }
  };

    useEffect(() => {
      //getDocuments();
      fetchData()
    }, []);

    
  const colDocumentos = [
        {   key:"_id", encabezado: "#"} ,
        {   key:"FCTM_document_name", encabezado: "Nombre"} ,
        {   key:"FCTM_document_url", encabezado: "Ruta"},
        {   key:"FCTM_document_description", encabezado: "Descripción"},
        {   key:"FCTM_document_type", encabezado: "Tipo Doc."}        
    ]

  

  function verFicha(id){
    navigate(`/documents/${id}`);
  }

  function eliminar(){
    alert("Eliminando...")
  }

  return (
    <section className='dashboard section'>
      <div className="row mb-3">
        <div className="col-12">
          <button className="btn btn-success" onClick={crearDocumento}>
            Añadir Documento
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {loading ? (
            <p>Cargando documentos...</p>
          ) : (
            <ReactTableTanstack
              tableTitle='Gestión Documental'
              datos={documentos}
              columnas={colDocumentos}
            />
          )}
        </div>
      </div>
    </section>
);
}

export default ListDocuments