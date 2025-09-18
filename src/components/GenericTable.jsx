import React, { useRef, useEffect, useState } from 'react'
import GenericButton from './GenericButton'
import $, { event } from "jquery";
import 'datatables.net-responsive-bs5';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';

const GenericTable = ({
    tableTitle = '',
    datos = [],
    columnas = [],
    onShow,
    onDelete
}) => {

    const tableRef = useRef()

    //Función para aplicar funcionalidad DataTable.Net (responsive)
    const usingDatatableNetFormat = () => {
        const $el = $(tableRef.current);

        // Destroy if already exists
        if ($.fn.DataTable.isDataTable($el)) {
            $el.DataTable().clear().destroy();
        }

        // Init new instance
        const dt = $el.DataTable({
            responsive: true,
            stateSave: false,
            language,
        });

        // Optional cleanup
        return () => {
            if ($.fn.DataTable.isDataTable($el)) {
                $el.DataTable().clear().destroy();
            }
        };
    };

    //Aplicar funcionalidad DataTable.Net (responsive) cuando los datos cambien (gracias al KEY que se pasa desde el componente padre que llama)
    useEffect(() => {
        usingDatatableNetFormat()
    }, []);



  return (

     <div className="card recent-sales overflow-auto">      
      <div className="card-body">
        <h5 className="card-title">
          {tableTitle}
        </h5>
            <table ref={tableRef} className="table table-responsive table-borderless datatable table-hover align-middle text-center">
                <thead className="table-light">
                    <tr>                
                        {columnas.map(function(col){
                            return(<th key={col.key}>{col.encabezado}</th>)
                        })}
                        {/*<th>Ver</th>*/}
                        <th>Info</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((elem) => (
                    <tr key={elem._id}>
                        {columnas.map(function(col){
                            return(<td key={col.key}>{elem[col.key]}</td>)
                        })}                
                        {/*<td>                   
                            <GenericButton toParam={`/${elem._id}`} classNameParam='btn btn-outline-primary btn-sm' labelParam='Show' iconParam={<i className="fas fa-search"></i>} />
                        </td>*/}
                        <td>
                            <button className="btn btn-info" 
                            onClick={()=>onShow(elem._id)}>
                            <i className="fa-sharp fa-solid fa-magnifying-glass fa-rotate-90 fa-1xs"></i>
                            </button>
                        </td>
                        <td>
                            <button className="btn btn-danger" 
                            onClick={()=>onDelete(elem._id)}>
                            <i className="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>
    </div>
  )
}

export default GenericTable