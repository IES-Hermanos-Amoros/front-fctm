import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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

const skillOptions = [
  { _id: "69bd6bb2e1aa8f195c71c305", FCTM_skill_name: "ADAPTABILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c31d", FCTM_skill_name: "ADMINISTRACION DE SISTEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c339", FCTM_skill_name: "ADOBE ILLUSTRATOR" },
  { _id: "69bd6bb2e1aa8f195c71c338", FCTM_skill_name: "ADOBE PHOTOSHOP" },
  { _id: "69bd6bb2e1aa8f195c71c341", FCTM_skill_name: "AGRICULTURA ECOLOGICA" },
  { _id: "69bd6bb2e1aa8f195c71c320", FCTM_skill_name: "ANGULAR" },
  { _id: "69bd6bb2e1aa8f195c71c32b", FCTM_skill_name: "ANALISIS DE DATOS" },
  { _id: "69bd6bb2e1aa8f195c71c32e", FCTM_skill_name: "ATENCION AL CLIENTE" },
  { _id: "69bd6bb2e1aa8f195c71c322", FCTM_skill_name: "AWS" },
  { _id: "69bd6bb2e1aa8f195c71c323", FCTM_skill_name: "AZURE" },
  { _id: "69bd6bb2e1aa8f195c71c344", FCTM_skill_name: "BOTANICA" },
  { _id: "69bd6bb2e1aa8f195c71c325", FCTM_skill_name: "C#" },
  { _id: "69bd6bb2e1aa8f195c71c326", FCTM_skill_name: "C++" },
  { _id: "69bd6bb2e1aa8f195c71c316", FCTM_skill_name: "CIBERSEGURIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c315", FCTM_skill_name: "CLOUD COMPUTING" },
  { _id: "69bd6bb2e1aa8f195c71c301", FCTM_skill_name: "COMUNICACION EFECTIVA" },
  { _id: "69bd6bb2e1aa8f195c71c332", FCTM_skill_name: "CONTENT MARKETING" },
  { _id: "69bd6bb2e1aa8f195c71c345", FCTM_skill_name: "CONTROL DE PLAGAS" },
  { _id: "69bd6bb2e1aa8f195c71c308", FCTM_skill_name: "CREATIVIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c310", FCTM_skill_name: "CSS3" },
  { _id: "69bd6bb2e1aa8f195c71c329", FCTM_skill_name: "DESARROLLO DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c30b", FCTM_skill_name: "DESARROLLO WEB" },
  { _id: "69bd6bb2e1aa8f195c71c335", FCTM_skill_name: "DISENO GRAFICO" },
  { _id: "69bd6bb2e1aa8f195c71c33b", FCTM_skill_name: "DOCENCIA" },
  { _id: "69bd6bb2e1aa8f195c71c318", FCTM_skill_name: "DOCKER" },
  { _id: "69bd6bb2e1aa8f195c71c334", FCTM_skill_name: "E-COMMERCE" },
  { _id: "69bd6bb2e1aa8f195c71c33c", FCTM_skill_name: "E-LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c33a", FCTM_skill_name: "EDICION DE VIDEO" },
  { _id: "69bd6bb2e1aa8f195c71c30a", FCTM_skill_name: "EMPATIA" },
  { _id: "69bd6bb2e1aa8f195c71c328", FCTM_skill_name: "ESTRATEGIA DE NEGOCIO" },
  { _id: "69bd6bb2e1aa8f195c71c337", FCTM_skill_name: "FIGMA" },
  { _id: "69bd6bb2e1aa8f195c71c343", FCTM_skill_name: "GESTION AMBIENTAL" },
  { _id: "69bd6bb2e1aa8f195c71c327", FCTM_skill_name: "GESTION DE PROYECTOS" },
  { _id: "69bd6bb2e1aa8f195c71c303", FCTM_skill_name: "GESTION DEL TIEMPO" },
  { _id: "69bd6bb2e1aa8f195c71c347", FCTM_skill_name: "GESTION FORESTAL" },
  { _id: "69bd6bb2e1aa8f195c71c317", FCTM_skill_name: "GIT" },
  { _id: "69bd6bb2e1aa8f195c71c333", FCTM_skill_name: "GOOGLE ANALYTICS" },
  { _id: "69bd6bb2e1aa8f195c71c309", FCTM_skill_name: "HABLAR EN PUBLICO" },
  { _id: "69bd6bb2e1aa8f195c71c30f", FCTM_skill_name: "HTML5" },
  { _id: "69bd6bb2e1aa8f195c71c33e", FCTM_skill_name: "INTEGRACION SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c31a", FCTM_skill_name: "INTELIGENCIA ARTIFICIAL" },
  { _id: "69bd6bb2e1aa8f195c71c307", FCTM_skill_name: "INTELIGENCIA EMOCIONAL" },
  { _id: "69bd6bb2e1aa8f195c71c33d", FCTM_skill_name: "INTERVENCION SOCIAL" },
  { _id: "69bd6bb2e1aa8f195c71c348", FCTM_skill_name: "JARDINERIA" },
  { _id: "69bd6bb2e1aa8f195c71c30e", FCTM_skill_name: "JAVA" },
  { _id: "69bd6bb2e1aa8f195c71c30c", FCTM_skill_name: "JAVASCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c319", FCTM_skill_name: "KUBERNETES" },
  { _id: "69bd6bb2e1aa8f195c71c2ff", FCTM_skill_name: "LIDERAZGO" },
  { _id: "69bd6bb2e1aa8f195c71c31b", FCTM_skill_name: "MACHINE LEARNING" },
  { _id: "69bd6bb2e1aa8f195c71c32f", FCTM_skill_name: "MARKETING DIGITAL" },
  { _id: "69bd6bb2e1aa8f195c71c306", FCTM_skill_name: "NEGOCIACION" },
  { _id: "69bd6bb2e1aa8f195c71c312", FCTM_skill_name: "NODE.JS" },
  { _id: "69bd6bb2e1aa8f195c71c314", FCTM_skill_name: "NOSQL" },
  { _id: "69bd6bb2e1aa8f195c71c340", FCTM_skill_name: "ORIENTACION LABORAL" },
  { _id: "69bd6bb2e1aa8f195c71c342", FCTM_skill_name: "PAISAJISMO" },
  { _id: "69bd6bb2e1aa8f195c71c304", FCTM_skill_name: "PENSAMIENTO CRITICO" },
  { _id: "69bd6bb2e1aa8f195c71c324", FCTM_skill_name: "PHP" },
  { _id: "69bd6bb2e1aa8f195c71c32a", FCTM_skill_name: "PLANIFICACION ESTRATEGICA" },
  { _id: "69bd6bb2e1aa8f195c71c33f", FCTM_skill_name: "PSICOLOGIA" },
  { _id: "69bd6bb2e1aa8f195c71c30d", FCTM_skill_name: "PYTHON" },
  { _id: "69bd6bb2e1aa8f195c71c311", FCTM_skill_name: "REACT" },
  { _id: "69bd6bb2e1aa8f195c71c32c", FCTM_skill_name: "RECURSOS HUMANOS" },
  { _id: "69bd6bb2e1aa8f195c71c31e", FCTM_skill_name: "REDES DE COMPUTADORES" },
  { _id: "69bd6bb2e1aa8f195c71c302", FCTM_skill_name: "RESOLUCION DE PROBLEMAS" },
  { _id: "69bd6bb2e1aa8f195c71c331", FCTM_skill_name: "SEM" },
  { _id: "69bd6bb2e1aa8f195c71c330", FCTM_skill_name: "SEO" },
  { _id: "69bd6bb2e1aa8f195c71c31c", FCTM_skill_name: "SOPORTE TECNICO" },
  { _id: "69bd6bb2e1aa8f195c71c346", FCTM_skill_name: "SOSTENIBILIDAD" },
  { _id: "69bd6bb2e1aa8f195c71c313", FCTM_skill_name: "SQL" },
  { _id: "69bd6bb2e1aa8f195c71c300", FCTM_skill_name: "TRABAJO EN EQUIPO" },
  { _id: "69bd6bb2e1aa8f195c71c31f", FCTM_skill_name: "TYPESCRIPT" },
  { _id: "69bd6bb2e1aa8f195c71c336", FCTM_skill_name: "UI/UX" },
  { _id: "69bd6bb2e1aa8f195c71c32d", FCTM_skill_name: "VENTAS" },
  { _id: "69bd6bb2e1aa8f195c71c321", FCTM_skill_name: "VUE.JS" }
];

const normalizationConfig = [
  {
    field: "FCTM_company_category",
    options: categoryOptions,
    optionValue: "_id",
    optionLabel: "FCTM_category_name",
    type: "multi"
  },
  {
    field: "FCTM_skills",
    options: skillOptions,
    optionValue: "_id",
    optionLabel: "FCTM_skill_name",
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

  const normalizeSkillOption = useCallback((skill) => {
    if (!skill) return null;

    if (typeof skill === "object") {
      if (skill.value && skill.label) return skill;

      const label = skill.FCTM_skill_name || skill.label || skill.name || skill.nombre || null;
      const value = skill._id || skill.value || label;

      return label ? { value, label } : null;
    }

    const match = skillOptions.find(
      (option) => option._id === skill || option.FCTM_skill_name === skill
    );

    if (match) return { value: match._id, label: match.FCTM_skill_name };

    return typeof skill === "string" && skill.trim()
      ? { value: skill.trim(), label: skill.trim() }
      : null;
  }, []);

  const normalizeCompanyData = useCallback((company) => {
    const configWithoutSkills = normalizationConfig.filter((c) => c.field !== "FCTM_skills");
    const normalized = normalizeFromApi(company, configWithoutSkills);
    const rawSkills = company?.FCTM_skills ?? company?.FCTM_company_skills ?? [];
    const skillsArray = Array.isArray(rawSkills) ? rawSkills : [rawSkills];

    normalized.FCTM_skills = skillsArray.map(normalizeSkillOption).filter(Boolean);

    return normalized;
  }, [normalizeSkillOption]);

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    const res = await sendRequest("GET", null, `/companies/${id}`);

    if (res.success) {
      const normalized = normalizeCompanyData(res.data);
      setData(normalized);
      setOriginalData(normalized);
    } else {
      showAlert("Error al cargar la empresa", "error");
    }

    setLoading(false);
  }, [id, normalizeCompanyData]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

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
      const configWithoutSkills = normalizationConfig.filter((c) => c.field !== "FCTM_skills");
      const payloadNormalizado = normalizeToApi(fctmOnly, configWithoutSkills);

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

  const skillSelectOptions = useMemo(
    () => skillOptions.map((skill) => ({ value: skill._id, label: skill.FCTM_skill_name })),
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
              <CreatableSelect
                options={skillSelectOptions}
                isMulti
                value={data.FCTM_skills || []}
                onChange={(selected) => handleChange("FCTM_skills", selected || [])}
                placeholder="Selecciona o crea Skills / Tecnologias..."
                closeMenuOnSelect={false}
                isDisabled={!isEditing}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
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
