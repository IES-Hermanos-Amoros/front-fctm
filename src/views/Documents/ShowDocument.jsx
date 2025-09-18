let documentos = [
    { _id: 1,
      nombre: "Decreto 485/2025",
      ruta: "../documents/doc1.pdf"
     },
     { _id: 2,
      nombre: "Ley 1111",
      ruta: "../documents/doc2.pdf"
     },
     { _id: 3,
      nombre: "Currículum Pepe",
      ruta: "../documents/doc3.pdf"
     }
  ]

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ShowDocument = () => {
    const {id} = useParams()
  const navigate = useNavigate();

  const documento =  documentos.find(doc => doc._id.toString() === id);


  if (!documento) {
    return (
      <section className='dashboard section'>
        <div className='alert alert-danger'>Documento no encontrado</div>
        <button className='btn btn-secondary' onClick={() => navigate(-1)}>Volver</button>
      </section>
    );
  }

  return (
    <section className='dashboard section'>
      <div className="row mb-3">
        <div className="col-12">
          <h3>Ficha del Documento</h3>
          <button className='btn btn-secondary mt-2' onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card p-4 shadow-sm rounded-3">
            <div className="mb-3">
              <label className="form-label fw-bold">ID</label>
              <input type="text" className="form-control" value={documento._id} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre</label>
              <input type="text" className="form-control" value={documento.nombre} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Ruta</label>
              <input type="text" className="form-control" value={documento.ruta} disabled />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowDocument;