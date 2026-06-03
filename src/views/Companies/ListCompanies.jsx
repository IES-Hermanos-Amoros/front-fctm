import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { sendRequest,stringToColor,formatDateDDMMYYYY, confirmation, showAlert } from '../../utils/functions';
import { useNavigate } from 'react-router-dom'
import ListCRUD from "../../components/List/ListCRUD";
import useCategoryStore from '../../store/categoryStore';
import useSkillStore from '../../store/skillStore';
import Select from 'react-select';


const ListCompanies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedCategoriesBulk, setSelectedCategoriesBulk] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const categories = useCategoryStore((state) => state.categories);
    const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);
    const skillOptionsStore = useSkillStore((state) => state.skills);
    const cargarSkills = useSkillStore((state) => state.cargarSkills);

    const navigate = useNavigate();

    const filtersConfig = useMemo(() => [
      {
        key: "category",
        label: "Familias profesionales",
        options: categories,
        optionValue: "_id",
        optionLabel: "FCTM_category_name"
      }
    ], [categories]);

    const filteredData = useMemo(() => {
      if (!filters.category) return data;

      return data.filter((row) =>
        row.FCTM_company_category?.some((cat) => (cat._id || cat) === filters.category)
      );
    }, [data, filters]);

    const categoryOptionsSelect = useMemo(() => 
      categories.map(cat => ({ value: cat._id, label: cat.FCTM_category_name })), 
      [categories]
    );

    const handleBulkUpdateCategories = async () => {
      if (selectedIds.length === 0) return showAlert("No hay empresas seleccionadas", "warning");
      if (selectedCategoriesBulk.length === 0) return showAlert("No hay familias seleccionadas", "warning");

      const confirmado = await confirmation(`¿Actualizar familias para ${selectedIds.length} empresas?`);
      if (!confirmado) return;

      const payload = {
          ids: selectedIds,
          categoryIds: selectedCategoriesBulk.map(c => c.value)
      };

      const res = await sendRequest("PATCH", payload, "/companies/bulk-update-categories");

      if (res.success) {
          showAlert("Empresas actualizadas correctamente", "success");
          setSelectedIds([]);
          setSelectedCategoriesBulk([]);
          fetchData();
      } else {
          showAlert(res.message, "error");
      }
    };
    const formattedSkills = useMemo(() => {
      return skillOptionsStore.map(skill => ({
        value: skill._id,
        label: skill.FCTM_skill_name
      }));
    }, [skillOptionsStore]);

    // Columnas para la tabla
    const columnas = useMemo(() => [
        { key: 'SAO_username', encabezado: 'CIF' },
        { key: 'SAO_name', encabezado: 'Nombre' },
        { key: 'SAO_company_FCT_Number', encabezado: 'Nº Convenio FE' },
        /*{ key: 'SAO_company_FCT_Date', 
          encabezado: 'Fecha Convenio FE',
          render: row => row.SAO_company_FCT_Date ? formatDateDDMMYYYY(row.SAO_company_FCT_Date) : '-'
        },*/
        { 
          key: 'SAO_company_FCT_Date', 
          encabezado: 'Fecha Convenio FE',
          // 1. Usamos accessorFn para devolver un objeto Date o un número (timestamp)
          // Esto es lo que TanStack usará internamente para comparar/ordenar
          accessorFn: row => row.SAO_company_FCT_Date ? new Date(row.SAO_company_FCT_Date).getTime() : 0,
          // 2. Usamos render para definir cómo lo ve el usuario final
          render: row => row.SAO_company_FCT_Date ? formatDateDDMMYYYY(row.SAO_company_FCT_Date) : '-'
        },
        { key: 'SAO_company_city', encabezado: 'Localidad' },
        { key: "FCTM_company_category",
              encabezado: "Familias Profesionales",
              enableSorting: false, // ❌ DESACTIVAR ORDENACIÓN AQUÍ
              // Esta función le dice a la tabla qué texto usar para BUSCAR y FILTRAR
              accessorFn: (row) => 
                row.FCTM_company_category?.map(cat => cat.FCTM_category_name).join(" ") || "",
              
              // Esta función le dice a la tabla qué PINTAR en pantalla (tus chips)
              render: (row) => (
                <div className="d-flex flex-wrap gap-1">
                  {row.FCTM_company_category?.length > 0 ? (
                    row.FCTM_company_category.map((cat) => {
                      // Generamos el color basado en el nombre de la categoría
                      const bgColor = stringToColor(cat.FCTM_category_name);
                      
                      return (
                        <span 
                          key={cat._id} 
                          className="badge rounded-pill text-dark" // Quitamos bg-info
                          style={{ 
                            backgroundColor: bgColor, // Color dinámico
                            border: '1px solid rgba(0,0,0,0.1)',
                            fontSize: '0.75rem'
                          }}
                        >
                          {cat.FCTM_category_name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-muted small">Sin categorías</span>
                  )}
                </div>
              )
            },
                {
                  key: "FCTM_skills",
                  encabezado: "¿Con qué trabajan?",
                  enableSorting: false,
                  accessorFn: row => row.FCTM_skills?.map(skill => skill.FCTM_skill_name).join(" ") || "",
                  render: row => (
                    <div className="d-flex flex-wrap gap-1">
                      {row.FCTM_skills?.length > 0 ? (
                        row.FCTM_skills.map((skill) => {
                          const bgColor = stringToColor(skill.FCTM_skill_name);
                          return (
                            <span
                              key={skill._id}
                              className="badge rounded-pill text-dark"
                              style={{ backgroundColor: bgColor, border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                            >
                              {skill.FCTM_skill_name}
                            </span>
                          )
                        })
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </div>
                  )
                },
        // Columna de acción (ver ficha)
        {
            key: "__show",
            encabezado: "Ver",
            render: (row) => (
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/companies/${row._id}`)}
                    title="Ver ficha"
                >
                    <i className="bi bi-search"></i>
                </button>
            )
        }
    ], [navigate]);

    // Fetch de empresas
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await sendRequest('GET', null, '/companies');
            if (res.success) setData(res.data);
            else setError(res.message || 'Error al cargar empresas');
        } catch (err) {
            setError(err.message || 'Error al cargar empresas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { cargarCategorias(); }, [cargarCategorias]);
    useEffect(() => { cargarSkills(); }, [cargarSkills]);

    const handleBulkUpdate = async () => {
      if (selectedIds.length === 0) return showAlert("No hay empresas seleccionadas", "warning");
      if (selectedSkills.length === 0) return showAlert("Debes seleccionar al menos una aptitud", "warning");

      const confirmado = await confirmation(`¿Añadir ${selectedSkills.length} aptitudes a ${selectedIds.length} empresas?`);
      if (!confirmado) return;

      const skillsIds = selectedSkills.map(skill => skill.value);
      const payload = { ids: selectedIds, skills: skillsIds };

      const res = await sendRequest("PATCH", payload, "/companies/bulk-update-skills");

      if (res.success) {
        showAlert("Aptitudes actualizadas correctamente", "success");
        setSelectedIds([]);
        setSelectedSkills([]);
        fetchData();
      } else {
        showAlert(res.message, "error");
      }
    };

    return (
        <>            
            {loading && 
                 <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              }
            {!loading && error && <p className="text-danger">{error}</p>}
            {!loading && !error && data.length === 0 && (
                <p className="text-muted">No hay empresas disponibles</p>
            )}
            {!loading && !error && data.length > 0 && (                
                <ListCRUD
                  title="Listado de Empresas"
                  datos={filteredData}
                  columnas={columnas}
                  tableId="empresas"
                  mostrarCheckBox
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  filters={filters}
                  onFilterChange={setFilters}
                  filtersConfig={filtersConfig}
                >                
                  <div className="d-flex flex-wrap gap-2 mb-3 align-items-end">
                    {selectedIds.length > 0 && (
                      <>
                        <div style={{ minWidth: '300px' }}>
                          <label className="form-label fw-bold small mb-1">Familias Profesionales</label>                          
                          <Select
                              isMulti
                              options={categoryOptionsSelect}
                              value={selectedCategoriesBulk}
                              onChange={setSelectedCategoriesBulk}
                              placeholder="Busca y selecciona familias..."
                              noOptionsMessage={() => "No hay más familias"}
                              classNamePrefix="react-select"                              
                              className="react-select-container"
                          />
                        </div>
                        <button className="btn btn-warning" onClick={handleBulkUpdateCategories}>
                          <i className="bi bi-pencil-square me-1"></i>
                          Actualizar Familias ({selectedIds.length})
                        </button>
                      </>
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3 align-items-end">
                    {selectedIds.length > 0 && (
                      <>
                        <div style={{ minWidth: '300px' }}>
                          <label className="form-label fw-bold small mb-1">¿Con qué trabajan?</label>
                          <Select
                            isMulti
                            options={formattedSkills}
                            value={selectedSkills}
                            onChange={setSelectedSkills}
                            placeholder="Selecciona aptitudes..."
                            noOptionsMessage={() => "No hay más aptitudes"}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                        <button className="btn btn-warning" onClick={handleBulkUpdate}>
                          <i className="bi bi-pencil-square me-1"></i>
                          Actualizar aptitudes ({selectedIds.length})
                        </button>
                      </>
                    )}
                  </div>
                </ListCRUD>
            )}
        </>
    );
};

export default ListCompanies;