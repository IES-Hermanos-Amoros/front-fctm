import React, { useRef, useEffect } from 'react';
import $, { event } from "jquery";
import 'datatables.net';
import 'datatables.net-responsive';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import './GenericTable.css'; // tu CSS personalizado

const GenericTable = ({
  tableTitle = '',
  datos = [],
  columnas = [],
  onShow,
  onDelete
}) => {

  const tableRef = useRef();

  // Inicialización de DataTables
  const initDataTable = () => {
    const $el = $(tableRef.current);

    if ($.fn.DataTable.isDataTable($el)) {
      $el.DataTable().clear().destroy();
    }

    const mobileLanguage = {
        ...language, // mantiene todas las traducciones existentes
        paginate: {
            first: '<i class="fas fa-angle-double-left"></i>',
            previous: '<i class="fas fa-angle-left"></i>',
            next: '<i class="fas fa-angle-right"></i>',
            last: '<i class="fas fa-angle-double-right"></i>'
        }
    };

    $el.DataTable({
      responsive: true,       // Row Collapse para móviles
      stateSave: false,
      language:mobileLanguage,
      autoWidth: false,       // Respetar anchos CSS
      columnDefs: [
        { targets: '_all', className: 'dt-head-center dt-body-center' }
      ]
    });

    // Limpieza al desmontar
    return () => {
      if ($.fn.DataTable.isDataTable($el)) {
        $el.DataTable().clear().destroy();
      }
    };
  };

  useEffect(() => {
    initDataTable();
  }, [datos]);

  return (
    <div className="card recent-sales overflow-auto">
      <div className="card-body">
        <h5 className="card-title">{tableTitle}</h5>
        <table
          ref={tableRef}
          className="table table-borderless table-hover align-middle text-center datatable dtr-inline"
        >
          <thead className="table-light">
            <tr>
              {columnas.map((col) => (
                <th key={col.key}>{col.encabezado}</th>
              ))}
              <th>Info</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((elem) => (
              <tr key={elem._id}>
                {columnas.map((col) => (
                  <td key={col.key}>{elem[col.key]}</td>
                ))}
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => onShow(elem._id)}>
                    <i className="fa-sharp fa-solid fa-magnifying-glass fa-rotate-90 fa-1xs"></i>
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(elem._id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;