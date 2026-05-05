import React from "react";
import ReactTableTanstack from "./ReactTableTanstack";
import ReactTableToolBar from "./ReactTableToolBar";

const ListCRUD = ({
  title = "",
  datos = [],
  columnas = [],
  tableProps = {}, // por si luego quieres pasar algo extra
  mobileMode = "card",
  mostrarCheckBox = false,
  selectedIds = [], // NUEVA PROP
  onSelectionChange, // NUEVA PROP
  filters = {},
  onFilterChange,
  filtersConfig = [],
  children, // para botones externos si quieres
}) => {
  return (
    <section className="dashboard section">

      {/* TOOLBAR DE EXPORTACIÓN */}
      <div className="row mb-1">
        <div className="col-12">
          <ReactTableToolBar 
            data={datos}
            columns={columnas}
            title={title} // PASAR EL TÍTULO PARA EXPORTACIÓN DINÁMICA
            filters={filters}
            onFilterChange={onFilterChange}
            filtersConfig={filtersConfig}
          >
          {/* Pasamos los hijos aquí */}
          {children}
          </ReactTableToolBar>
        </div>
      </div>


      <div className="row mt-0">
        <div className="col-12">
          <ReactTableTanstack
            tableTitle={title}
            datos={datos}
            columnas={columnas}
            mobileMode={mobileMode}
            mostrarCheckBox={mostrarCheckBox}
            selectedIds={selectedIds} // PASAR AL HIJO
            onSelectionChange={onSelectionChange} // PASAR AL HIJO
            {...tableProps}
          />
        </div>
      </div>
    </section>
  );
};

export default ListCRUD;
