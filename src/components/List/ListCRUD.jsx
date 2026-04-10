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
  children, // para botones externos si quieres
}) => {
  return (
    <section className="dashboard section">
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
            data={datos}
            columns={columnas}
            title={title} // PASAR EL TÍTULO PARA EXPORTACIÓN DINÁMICA
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
            {...tableProps}
          />
        </div>
      </div>
    </section>
  );
};

export default ListCRUD;
