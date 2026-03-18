import React, {useState, useEffect, useCallback, useMemo} from 'react'
import { sendRequest } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import "./ListDocuments.css"
import ListCRUD from "../../components/List/ListCRUD";


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
  const [error, setError] = useState(null);
  const [nextId, setNextId] = useState(4); // Para simular ID incremental
  const navigate = useNavigate();




     // Fetch de empresas
      const fetchData = useCallback(async () => {
          setLoading(true);
          setError(null);
          try {
              const res = await sendRequest('GET', null, '/documents');
              if (res.success) setDocumentos(res.data);
              else setError(res.message || 'Error al cargar documentos');
          } catch (err) {
              setError(err.message || 'Error al cargar documentos');
          } finally {
              setLoading(false);
          }
      }, []);

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

    useEffect(() => { fetchData(); }, [fetchData]);

    
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
    <>            
            {loading && <p>Cargando documentos...</p>}
            {!loading && error && <p className="text-danger">{error}</p>}
            {!loading && !error && documentos.length === 0 && (
                <p className="text-muted">No hay documentos disponibles</p>
            )}
            {!loading && !error && documentos.length > 0 && (                
                <ListCRUD
                  title="Gestión Documental"
                  datos={documentos}
                  columnas={colDocumentos}
                  tableId="documentos"                          
                >                          
                </ListCRUD>
            )}
        </>
);
}

export default ListDocuments