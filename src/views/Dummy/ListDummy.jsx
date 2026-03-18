import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest, confirmation, showAlert, stringToColor } from '../../utils/functions';
import { useNavigate } from 'react-router-dom';
import ListCRUD from "../../components/List/ListCRUD";

const ListDummy = () => {
  const [data, setData] = useState([]);
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
    {
      key: "FCTM_dummy_type",
      encabezado: "Tipo de Dato",
      filterType: "select",
      filterOptions: ["A", "B", "C"],
    },
    {
      key: "FCTM_category",
      encabezado: "Familias Profesionales",
      accessorFn: row => row.FCTM_category?.map(cat => cat.FCTM_category_name).join(" ") || "",
      render: row => (
        <div className="d-flex flex-wrap gap-1">
          {row.FCTM_category?.length > 0 ? (
            row.FCTM_category.map((cat) => {
              const bgColor = stringToColor(cat.FCTM_category_name);
              return (
                <span
                  key={cat._id}
                  className="badge rounded-pill text-dark"
                  style={{ backgroundColor: bgColor, border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                >
                  {cat.FCTM_category_name}
                </span>
              )
            })
          ) : (
            <span className="text-muted small">Sin categorías</span>
          )}
        </div>
      )
    },
    {
      key: "__show",
      encabezado: "Ver",
      render: row => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate(`/dummy/${row._id}`)}
          title="Ver ficha"
        >
          <i className="bi bi-search"></i>
        </button>
      )
    },
    {
      key: "__delete",
      encabezado: "Eliminar",
      render: row => (
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
  const handleDelete = async id => {
    const confirmado = await confirmation("¿Seguro que quieres eliminar este dato?");
    if (!confirmado) return;
    const res = await sendRequest("DELETE", undefined, `/dummy/${id}`);
    if (res.success) fetchData();
    else showAlert(res.message,"error");
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
    <>
      {loading && <p>Cargando datos...</p>}
      {!loading && error && <p className="text-danger">{error}</p>}
      {!loading && !error && data.length === 0 && <p className="text-muted">No hay datos disponibles</p>}
      {!loading && !error && data.length > 0 && (
        <ListCRUD
          title="Datos Dummy CRUD"
          datos={data}
          columnas={columnas}
          tableId="dummy"
          mostrarCheckBox
        >
          <button
            className="btn btn-success"
            onClick={() => navigate('/dummy/new')}
          >
            Añadir Dato
          </button>
        </ListCRUD>
      )}
    </>
  );
};

export default ListDummy;