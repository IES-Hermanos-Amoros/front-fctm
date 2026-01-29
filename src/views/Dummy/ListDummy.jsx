import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import ReactTableTanstack from '../../components/ReactTableTanstack';

const ListDummy = () => {
  // Estado para almacenar los datos que vienen del backend
  const [data, setData] = useState([]); // useState: mantiene los datos de la tabla
  const [loading, setLoading] = useState(false); // useState: controla si estamos cargando datos
  const [error, setError] = useState(null); // useState: guarda mensajes de error si falla la carga

  const navigate = useNavigate(); // hook de React Router para navegación programática

  // =======================
  // COLUMNAS MEMORIZADAS
  // =======================
  const columnas = useMemo(() => [
    { key: "_id", encabezado: "#" },
    { key: "SAO_id", encabezado: "SAO ID" },
    { key: "SAO_username", encabezado: "SAO Username" },
    { key: "SAO_email", encabezado: "SAO Email" },
    { key: "FCTM_dummy_observations", encabezado: "Observaciones" },
    { key: "FCTM_dummy_other_contact", encabezado: "Otro Contacto" },
    { key: "FCTM_dummy_description", encabezado: "Descripción" },
    { key: "FCTM_dummy_type", encabezado: "Tipo de Dato" }
  ], []); // useMemo: memoriza las columnas para que no se vuelvan a crear en cada render

  // =======================
  // FETCH DATA
  // =======================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await sendRequest("GET", null, "/dummy");

      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || "Error al cargar datos");
      }
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []); // useCallback: memoriza la función fetchData para que no cambie en cada render, útil para pasarla a useEffect

  useEffect(() => {
    fetchData();
  }, [fetchData]); // useEffect: ejecuta fetchData cuando el componente se monta y siempre que fetchData cambie (gracias a useCallback no cambia)

  // =======================
  // NAVEGACIÓN
  // =======================
  const verFicha = (id) => {
    navigate(`/dummy/${id}`);
  };

  // =======================
  // RENDER
  // =======================
  return (
    <section className="dashboard section">
      <div className="row mb-3">
        <div className="col-12">
          <button
            className="btn btn-success"
            onClick={() => navigate('/dummy/new')}
          >
            Añadir Dato
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {loading && <p>Cargando datos...</p>}
          {!loading && error && <p className="text-danger">{error}</p>}
          {!loading && !error && data.length === 0 && (
            <p className="text-muted">No hay datos disponibles</p>
          )}
          {!loading && !error && data.length > 0 && (
            <ReactTableTanstack
              tableTitle="Datos Dummy"
              datos={data}
              columnas={columnas}
              mobileMode="card"
              mostrarCheckBox={true}
              onRowClick={verFicha}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ListDummy;
