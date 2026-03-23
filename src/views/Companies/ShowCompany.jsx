import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  sendRequest,
  showAlert,
  confirmation,
  normalizeFromApi,
  normalizeToApi,
  pickFCTMFields,
  formatDateDDMMYYYY
} from "../../utils/functions";

import ShowHeader from "../../components/Show/ShowHeader";
import ShowEditableForm from "../../components/Show/ShowEditableForm";
import ListCRUD from "../../components/List/ListCRUD";

const categoryOptions = [
  { _id: "69a82074499df1aec1d2477e", FCTM_category_name: "AGRO-JARDINERIA Y COMPOSICIONES FLORALES" },
  { _id: "69a82074499df1aec1d2477f", FCTM_category_name: "DESARROLLO DE APLICACIONES WEB" },
  { _id: "69a82074499df1aec1d24780", FCTM_category_name: "EDUCACION INFANTIL" },
  { _id: "69a82074499df1aec1d24781", FCTM_category_name: "GESTION FORESTAL Y DEL MEDIO NATURAL" },
  { _id: "69a82074499df1aec1d24782", FCTM_category_name: "INTEGRACION SOCIAL" },
  { _id: "69a82074499df1aec1d24783", FCTM_category_name: "PRODUCCION AGROECOLOGICA" },
  { _id: "69a82074499df1aec1d24784", FCTM_category_name: "SISTEMAS MICROINFORMATICOS Y REDES" }
];

const categoryNormalizationConfig = [
  {
    field: "FCTM_company_category",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  }
];

const camposSAO = [
  { key: "SAO_id", label: "ID Interno SAO" },
  { key: "SAO_username", label: "CIF" },
  { key: "SAO_registryDate", label: "Fecha de Registro" },
  { key: "SAO_accessDate", label: "Ultimo Acceso" },
  { key: "SAO_name", label: "Nombre / Razon Social" },
  { key: "SAO_organization", label: "Organizacion / Centro" },
  { key: "SAO_group", label: "Grupo / Curso" },
  { key: "SAO_email", label: "E-mail" },
  { key: "SAO_phone", label: "Telefono de Contacto" },
  { key: "SAO_company_FCT_Number", label: "Nº Convenio FE" },
  { key: "SAO_company_FCT_Date", label: "Fecha Convenio FE" },
  { key: "SAO_company_FPDual_Number", label: "Nº Convenio FE Intensiva" },
  { key: "SAO_company_FPDual_Date", label: "Fecha Convenio FE Intensiva" },
  { key: "SAO_company_city", label: "Localidad" },
  { key: "SAO_company_state", label: "Provincia" },
  { key: "SAO_company_address", label: "Direccion Social" },
  { key: "SAO_company_activity", label: "Actividad Economica" },
  { key: "SAO_company_nameManager", label: "Nombre del Representante / Gerente" },
  { key: "SAO_company_idManager", label: "DNI/NIE del Representante" },
  { key: "SAO_company_deedDate", label: "Fecha de Escritura" }
];

const ShowCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [skillOptions, setSkillOptions] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const normalizeSkillOption = useCallback((skill) => {
    if (!skill) return null;

    if (typeof skill === "object") {
      if (skill.value && skill.label) return skill;

      const label = skill.FCTM_skill_name || skill.label || skill.name || skill.nombre || null;
      const value = skill._id || skill.value || label;

      return label ? { value, label } : null;
    }

    const match = skillOptions.find(
      (option) => option.value === skill || option.label === skill
    );

    if (match) return match;

    return typeof skill === "string" && skill.trim()
      ? { value: skill.trim(), label: skill.trim() }
      : null;
  }, [skillOptions]);

  const mergeSkillOptions = useCallback((skills = []) => {
    const normalizedSkills = skills
      .map(normalizeSkillOption)
      .filter(Boolean);

    setSkillOptions((prev) => {
      const merged = new Map();

      [...prev, ...normalizedSkills].forEach((skill) => {
        const key = String(skill.value || skill.label).toUpperCase();
        if (!merged.has(key)) {
          merged.set(key, skill);
        }
      });

      return Array.from(merged.values()).sort((a, b) => a.label.localeCompare(b.label, "es"));
    });
  }, [normalizeSkillOption]);

  const normalizeCompanyData = useCallback((company) => {
    const normalized = normalizeFromApi(company, categoryNormalizationConfig);
    const rawSkills = company?.FCTM_skills ?? company?.FCTM_company_skills ?? [];
    const skillsArray = Array.isArray(rawSkills) ? rawSkills : [rawSkills];

    normalized.FCTM_skills = skillsArray.map(normalizeSkillOption).filter(Boolean);

    return normalized;
  }, [normalizeSkillOption]);

  const fetchVerifiedSkills = useCallback(async () => {
    setSkillsLoading(true);
    const res = await sendRequest("GET", null, "/skills");

    if (res.success) {
      mergeSkillOptions(res.data || []);
    }

    setSkillsLoading(false);
  }, [mergeSkillOptions]);

  const loadSkillOptions = useCallback(async (inputValue) => {
    const term = inputValue?.trim();
    const endpoint = term
      ? `/skills/search?q=${encodeURIComponent(term)}`
      : "/skills";

    const res = await sendRequest("GET", null, endpoint);
    if (!res.success) return skillOptions;

    const incomingSkills = (res.data || []).map(normalizeSkillOption).filter(Boolean);
    const merged = new Map();

    [...skillOptions, ...incomingSkills].forEach((skill) => {
      const key = String(skill.value || skill.label).toUpperCase();
      if (!merged.has(key)) {
        merged.set(key, skill);
      }
    });

    return Array.from(merged.values()).sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [normalizeSkillOption, skillOptions]);

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/companies/${id}`);

    if (res.success) {
      const rawSkills = res.data?.FCTM_skills ?? res.data?.FCTM_company_skills ?? [];
      mergeSkillOptions(Array.isArray(rawSkills) ? rawSkills : [rawSkills]);
      const normalized = normalizeCompanyData(res.data);
      setData(normalized);
      setOriginalData(normalized);
    } else {
      showAlert("Error al cargar la empresa", "error");
    }

    setLoading(false);
  }, [id, mergeSkillOptions, normalizeCompanyData]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  useEffect(() => {
    fetchVerifiedSkills();
  }, [fetchVerifiedSkills]);

  const handleDeleteJobOffer = useCallback(async (jobOfferId) => {
    const confirmed = await confirmation("¿Seguro que quieres eliminar esta oferta de trabajo?");
    if (!confirmed) return;

    const res = await sendRequest(
      "DELETE",
      undefined,
      `/joboffers/${jobOfferId}?companyId=${encodeURIComponent(id)}`
    );

    if (res.success) {
      await fetchCompany();
    } else {
      showAlert(res.message || "Error al eliminar oferta", "error");
    }
  }, [id, fetchCompany]);

  const columnasOfertas = useMemo(() => ([
    { key: "FCTM_job_title", encabezado: "Titulo" },
    {
      key: "FCTM_job_start_date",
      encabezado: "Fec. Ini",
      render: (row) => formatDateDDMMYYYY(row.FCTM_job_start_date)
    },
    {
      key: "FCTM_job_end_date",
      encabezado: "Fec. Fin",
      render: (row) => formatDateDDMMYYYY(row.FCTM_job_end_date)
    },
    { key: "FCTM_job_status", encabezado: "Estado" },
    {
      key: "__show",
      encabezado: "Ver",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => navigate(`/joboffers/${row._id}`, { state: { companyId: id } })}
          title="Ver oferta"
        >
          <i className="bi bi-search"></i>
        </button>
      )
    },
    {
      key: "__delete",
      encabezado: "Eliminar",
      render: (row) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteJobOffer(row._id)}
          title="Eliminar oferta"
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ]), [navigate, id, handleDeleteJobOffer]);

  const handleSave = async () => {
    try {
      let skillNames = [];

      if (data.FCTM_skills) {
        skillNames = data.FCTM_skills
          .map((skill) => {
            const normalizedSkill = normalizeSkillOption(skill);
            return normalizedSkill?.label ? normalizedSkill.label.trim().toUpperCase() : null;
          })
          .filter(Boolean);
      }

      const resSkills = await sendRequest("POST", { names: skillNames }, "/skills/ensure");
      if (!resSkills.success) return showAlert("Error en skills", "error");

      const skillIds = resSkills.data;
      const fctmOnly = pickFCTMFields(data);
      const payloadNormalizado = normalizeToApi(fctmOnly, categoryNormalizationConfig);

      const finalPayload = {
        ...payloadNormalizado,
        FCTM_skills: skillIds
      };

      const res = await sendRequest("PATCH", finalPayload, `/companies/${id}`);

      if (res.success) {
        const normalized = normalizeCompanyData({
          ...res.data,
          FCTM_skills: data.FCTM_skills
        });
        setData(normalized);
        setOriginalData(normalized);
        setIsEditing(false);
      } else {
        showAlert(res.message || "Error al guardar los cambios", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error critico", "error");
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setData(originalData);
    setIsEditing(false);
  };

  const categorySelectOptions = useMemo(
    () => categoryOptions.map((category) => ({ value: category._id, label: category.FCTM_category_name })),
    []
  );

  if (loading) return <p>Cargando informacion...</p>;
  if (!data) return <p>Empresa no encontrada.</p>;

  return (
    <section>
      <ShowHeader
        title={`Ficha de ${data?.SAO_name || "Empresa"}`}
        onBack={() => navigate("/companies")}
      />

      <div className="mb-4">
        <h3>Informacion SAO</h3>
        <ShowEditableForm
          formTitle="Datos de SAO"
          formId="saoForm"
          data={data}
          fields={camposSAO}
          hideEditButton={true}
        />
      </div>

      <hr />

      <div className="mb-4">
        <h3>Datos Adicionales FCTM</h3>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Gestion de Datos FCTM</strong>

            {!isEditing && (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Editar
              </button>
            )}

            {isEditing && (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-success" onClick={handleSave}>
                  Guardar
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Familias Profesionales</label>
              <Select
                options={categorySelectOptions}
                isMulti
                value={data.FCTM_company_category || []}
                onChange={(selected) => handleChange("FCTM_company_category", selected || [])}
                placeholder="Selecciona Familias Profesionales..."
                closeMenuOnSelect={false}
                isDisabled={!isEditing}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Skills / Tecnologias</label>
              <AsyncCreatableSelect
                cacheOptions
                defaultOptions={skillOptions}
                loadOptions={loadSkillOptions}
                isMulti
                value={data.FCTM_skills || []}
                onChange={(selected) => {
                  const nextSkills = selected || [];
                  handleChange("FCTM_skills", nextSkills);
                  mergeSkillOptions(nextSkills);
                }}
                placeholder="Selecciona o crea Skills / Tecnologias..."
                closeMenuOnSelect={false}
                isDisabled={!isEditing}
                isLoading={skillsLoading}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                noOptionsMessage={({ inputValue }) => (
                  inputValue?.trim()
                    ? "No hay skills verificadas con ese nombre"
                    : "No hay skills disponibles"
                )}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Interesada en contratar</label>
              <select
                className="form-select"
                value={String(data.FCTM_company_openToHire ?? "")}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange(
                    "FCTM_company_openToHire",
                    value === "true" ? true : value === "false" ? false : ""
                  );
                }}
                disabled={!isEditing}
              >
                <option value="">-- Selecciona --</option>
                <option value="true">Si</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Otro contacto</label>
              <input
                className="form-control"
                type="text"
                value={data.FCTM_company_other_contact || ""}
                onChange={(e) => handleChange("FCTM_company_other_contact", e.target.value)}
                readOnly={!isEditing}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Observaciones</label>
              <textarea
                className="form-control"
                rows={4}
                value={data.FCTM_company_observations || ""}
                onChange={(e) => handleChange("FCTM_company_observations", e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <ListCRUD
        title="Ofertas de Trabajo Relacionadas"
        datos={data.FCTM_job_offers || []}
        columnas={columnasOfertas}
      >
        <button
          className="btn btn-primary"
          onClick={() => navigate("/joboffers/new", { state: { companyId: id } })}
        >
          Nueva Oferta de Trabajo
        </button>
      </ListCRUD>
    </section>
  );
};

export default ShowCompany;
