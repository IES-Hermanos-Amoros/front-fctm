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

      {/* FILTRO TEMPORAL INI */}
      {/*<div className="row mb-2">
        {filtersConfig.map(filter => (
          <div className="col-md-4" key={filter.key}>
            <select
              className="form-select"
              value={filters[filter.key] || ""}
              onChange={(e) =>
                onFilterChange(prev => ({
                  ...prev,
                  [filter.key]: e.target.value
                }))
              }
            >
              <option value="">Todos - {filter.label}</option>

              {filter.options.map(opt => (
                <option
                  key={opt[filter.optionValue]}
                  value={opt[filter.optionValue]}
                >
                  {opt[filter.optionLabel]}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>*/}
      {/* FILTRO TEMPORAL FIN */}

    
      <div className="row mb-3">
        <div className="col-12">
          {/*{title && <h3 className="m-0">{title}</h3>}*/}
          {children} {/* BOTON NUEVO - Ir al .../new */}
        </div>
      </div>

      {/* TOOLBAR DE EXPORTACIÓN */}
      <div className="row">
        <div className="col-12">
          <ReactTableToolBar 
            data={datosFiltrados} // PASAR LOS DATOS FILTRADOS
            columns={columnas}
            title={title} // PASAR EL TÍTULO PARA EXPORTACIÓN DINÁMICA
            filters={filters}
            onFilterChange={onFilterChange}
            filtersConfig={filtersConfig}
          />
        </div>
      </div>


      <div className="row">
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
