import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import ReactTableTanstack from '../../components/ReactTableTanstack';

const ListDummy = () => {
  const [data, setData] = useState([]); // Datos de la tabla
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
    { key: "FCTM_dummy_type", encabezado: "Tipo de Dato" },

    // Columna de acción (ver ficha)
    {
      key: "__show",
      encabezado: "Ver",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate(`/dummy/${row._id}`)}
          title="Ver ficha"
        >
          <i className="bi bi-search"></i>
        </button>
      )
    },
    // Columna de eliminar
    {
      key: "__delete",
      encabezado: "Eliminar",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDelete(row._id)}
          title="Eliminar dato"
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ], [navigate]);


  // =======================
  // ELIMINAR DATO
  // =======================
  const handleDelete = async (id) => {
    const confirmado = window.confirm("¿Seguro que quieres eliminar este dato?");
    if (!confirmado) return;

    const res = await sendRequest("DELETE", null, `/dummy/${id}`);
    if (res.success) {
      alert("Dato eliminado");
      fetchData(); // recargamos tabla
    } else {
      alert("Error al eliminar el dato");
    }
  };

  // =======================
  // FETCH DATA
  // =======================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendRequest("GET", null, "/dummy");
      if (res.success) setData(res.data);
      else setError(res.message || "Error al cargar datos");
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

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
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ListDummy;