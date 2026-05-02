import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import {
  sendRequest,
  getBackendHost,
  formatDateDDMMYYYYHHmm,
  showAlert,
} from '../../utils/functions'
import Swal from 'sweetalert2'
import useUserStore from '../../store/userStore'
import './ListDocuments.css'
import ListCRUD from '../../components/List/ListCRUD'

const ListDocuments = () => {  
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = useUserStore(state => state.user)
  const navigate = useNavigate();
  const userId =
    user?._id || user?.id || user?.user?._id || user?.user?.id || null
  const handleDelete = async row => {
    const confirm = await Swal.fire({
      title: '¿Eliminar documento?',
      text: 'Esta acción no se puede deshacer. ¿Seguro que quieres eliminar el documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!confirm.isConfirmed) return
    try {
      const res = await sendRequest('DELETE', null, `/documents/${row._id}`)
      if (res.success) {
        showAlert('Documento eliminado correctamente', 'success')
        fetchData()
      }
    } catch (err) {
      showAlert('Error al eliminar el documento', 'error')
    }
  }

  const hostAPI = getBackendHost()

  const handleDownload = async row => {
    try {
      const url = `${hostAPI}/documents/${row._id}/download`

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
        withCredentials: true,
      })

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', row.FCTM_document_name || 'archivo')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Error en la descarga:', err)

      if (err.response && err.response.status === 404) {
        showAlert('El archivo no existe en el servidor', 'error')
      } else {
        showAlert('Error al intentar descargar el archivo', 'error')
      }
    }
  }

  // Fetch de documentos
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await sendRequest('GET', null, '/documents')
      if (res.success) setDocumentos(res.data)
      else setError(res.message || 'Error al cargar documentos')
    } catch (err) {
      setError(err.message || 'Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    //EVITAMOS RENDERIZADOS INNECESARIOS
    /*const onFocus = () => fetchData()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)*/
  }, [fetchData])

  const colDocumentos = useMemo(() => [
    { key: 'FCTM_document_name', encabezado: 'Nombre' },
    { key: 'FCTM_document_description', encabezado: 'Descripción' },
    { key: 'FCTM_document_type', encabezado: 'Tipo' },
    {
      key: 'related_to',
      encabezado: 'Relacionado con',
      render: row => {
        const relations = []

        // Oferta de trabajo
        if (row.oferta_relacionada && row.oferta_relacionada.length > 0) {
          row.oferta_relacionada.forEach(oferta => {
            relations.push(
              <div
                key={`offer-${oferta._id}`}
                className="badge bg-primary me-1"
                title="Oferta de Trabajo"
              >
                <i className="bi bi-briefcase me-1"></i>
                {oferta.FCTM_job_title}{' '}
                {oferta.empresa ? `(${oferta.empresa.SAO_name})` : ''}
              </div>
            )
          })
        }

        // Usuarios (Alumnos/Profesores/Empresas)
        if (row.usuarios_relacionados && row.usuarios_relacionados.length > 0) {
          row.usuarios_relacionados.forEach(user => {
            let badgeClass = 'bg-secondary'
            let iconClass = 'bi-person'

            if (user.SAO_profile === 'ALUMNO') {
              badgeClass = 'bg-success'
              iconClass = 'bi-mortarboard'
            } else if (user.SAO_profile === 'PROFESOR') {
              badgeClass = 'bg-info text-dark'
              iconClass = 'bi-person-badge'
            }

            relations.push(
              <div
                key={`user-${user._id}`}
                className={`badge ${badgeClass} me-1`}
                title={user.SAO_profile}
              >
                <i className={`bi ${iconClass} me-1`}></i>
                {user.SAO_name}
              </div>
            )
          })
        }

        // Acciones
        if (row.acciones_relacionadas && row.acciones_relacionadas.length > 0) {
          row.acciones_relacionadas.forEach(accion => {
            relations.push(
              <div
                key={`action-${accion._id}`}
                className="badge bg-warning text-dark me-1"
                title="Acción"
              >
                <i className="bi bi-activity me-1"></i>
                {accion.FCTM_action_title || accion.FCTM_action_type}
              </div>
            )
          })
        }

        return relations.length > 0 ? (
          <div className="d-flex flex-wrap gap-1">{relations}</div>
        ) : (
          <span className="text-muted small">Sin relación</span>
        )
      },
    },
    {
      key: 'FCTM_inserted_date',
      encabezado: 'Fecha Subida',
      render: row => (
        <span className="small">
          {formatDateDDMMYYYYHHmm(row.FCTM_inserted_date)}
        </span>
      ),
    },
    {
      key: 'FCTM_document_created_by',
      encabezado: 'Subido por',
      render: row =>
        row.FCTM_document_created_by ? (
          row.FCTM_document_created_by.SAO_name
        ) : (
          <span className="text-muted">-</span>
        ),
    },
    {
      key: 'FCTM_document_url',
      encabezado: 'Acciones',
      render: row => {
        if (!row || !row.FCTM_document_url)
          return <span className="text-muted">-</span>

        return (
          <div className="d-flex gap-2">
            {/*<button
              onClick={() => handleDownload(row)}
              className="btn btn-sm btn-outline-primary"
              title="Descargar archivo"
            >
              <i className="bi bi-download"></i>
            </button>*/}            
            <a href={hostAPI + row.FCTM_document_url} 
                title="Descargar documento"
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-success"
            >
              <i className="bi bi-download"></i> {/* Icono de descarga */}
            </a>            
            <a
              href={`/documents/${row._id}`}
              className="btn btn-sm btn-outline-info"
              title="Ver detalles"
            >
              <i className="bi bi-search"></i>
            </a>            
            {userId &&
              row.FCTM_document_created_by &&
              (row.FCTM_document_created_by._id === userId ||
                row.FCTM_document_created_by === userId) && (
                <button
                  onClick={() => handleDelete(row)}
                  className="btn btn-sm btn-outline-danger"
                  title="Eliminar documento"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
          </div>
        )
      },
    },
  ], [userId, hostAPI]);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando documentos...</p>
            </div>
          )}
          {!loading && error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          {!loading && !error && (
            <ListCRUD
              title="Repositorio Documental"
              datos={documentos}
              columnas={colDocumentos}
              tableId="documentos"
            >
              {/*<div className="d-flex justify-content-end mb-2">
                <a
                  href="/documents/new"
                  className="btn btn-success"
                  style={{ minWidth: 180 }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Documento
                </a>
              </div>*/}
              <button className="btn btn-primary" onClick={() => navigate("/documents/new")}>
                Nuevo Documento
              </button>
            </ListCRUD>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListDocuments
