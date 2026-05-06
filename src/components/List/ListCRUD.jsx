import React, { useMemo } from "react";
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
  // Nuevas props extraídas de ReactTableTanstack
  globalFilter,
  setGlobalFilter,
}) => {

  // Lógica de filtrado para exportación
  const datosFiltrados = useMemo(() => {
    // Si globalFilter es undefined o vacío, devolvemos todos los datos
    if (!globalFilter) return datos;

    const target = globalFilter.toLowerCase();
    return datos.filter(fila => {
      // Usar Object.values es más seguro que JSON.stringify para evitar IDs ocultos
      return Object.values(fila).some(val => 
        String(val).toLowerCase().includes(target)
      );
    });
  }, [datos, globalFilter]);
  
  return (
    <section className="dashboard section">

      {/* TOOLBAR DE EXPORTACIÓN */}
      <div className="row g-0">
        <div className="col-12">
          <ReactTableToolBar 
            data={datosFiltrados} // PASAR LOS DATOS FILTRADOS
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


      <div className="row g-0">
        <div className="col-12">
          <ReactTableTanstack
            tableTitle={title}
            datos={datos}
            columnas={columnas}
            mobileMode={mobileMode}
            mostrarCheckBox={mostrarCheckBox}
            selectedIds={selectedIds} // PASAR AL HIJO
            onSelectionChange={onSelectionChange} // PASAR AL HIJO
            // Nuevas props para control de filtro global
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            {...tableProps}
          />
        </div>
      </div>
    </section>
  );
};

export default ListCRUD;
