import { useState, useEffect, Fragment } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import './ReactTableTanstack.css'

const ReactTableTanstack = ({
  tableTitle = '',
  datos = [],
  columnas = [],
  mobileMode = 'card', // 'collapse' | 'card'
  mostrarCheckBox = false,
  onSelectionChange = null, // callback opcional
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /*useEffect(() => {
    console.log('Estado de selectedIds actualizado:', Array.from(selectedIds))
  }, [selectedIds])*/

  const toggleRow = id =>
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }))

  const toggleSelection = id => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)

      console.log("IDs seleccionados actualmente:", [...newSet])

      if (onSelectionChange) onSelectionChange([...newSet])
      return newSet
    })
  }

  /* =======================
     COLUMNAS
  ======================= */
  /*const cols = [
    ...(mostrarCheckBox
      ? [{ id: '_checkbox', header: '', cell: ({ row }) => null }]
      : []),
    ...columnas.map(col => ({
      accessorKey: col.key !== "__actions" ? col.key : undefined, // columnas normales
      id: col.key,
      header: col.encabezado,
      cell: info =>
        col.render
          ? col.render(info.row.original) // usa render si existe
          : info.getValue(),
    })),
  ]*/
  const cols = [
    ...(mostrarCheckBox
      ? [{ id: '_checkbox', header: '', cell: ({ row }) => null }]
      : []),
    ...columnas.map(col => ({
      // PRIORIDAD: 
      // 1. Si existe accessorFn, lo usamos (para filtros complejos como el de buscar por categorías (array))
      // 2. Si hay render pero no accessorFn, dejamos undefined (columnas de botones)
      // 3. Si no hay nada de lo anterior, usamos la key
      accessorFn: col.accessorFn ? col.accessorFn : undefined,
      accessorKey: (!col.accessorFn && !col.render) ? col.key : undefined,
      id: col.id || col.key, // TanStack necesita un ID único
      header: col.encabezado,
      cell: info =>
        col.render
          ? col.render(info.row.original) // columnas con render (acciones)
          : info.getValue(),             // columnas normales
    })),
  ]

  const table = useReactTable({
    data: datos,
    columns: cols,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  /* =======================
     MODO MOBILE CARD
  ======================= */
  if (isMobile && mobileMode === 'card') {
    return (
      <div className="rt-card">
        <div className="rt-card-body">
          <h1>{tableTitle}</h1>
          <input
            className="searchInput"
            placeholder="Buscar..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
          />

          <div className="cardsContainer">
            {table.getRowModel().rows.map(row => {
              const expanded = expandedRows[row.id] || false
              const selected = selectedIds.has(row.original._id)

              let longPressTimer = null
              const handleMouseDown = () => {
                longPressTimer = setTimeout(() => toggleSelection(row.original._id), 500)
              }
              const handleMouseUp = () => clearTimeout(longPressTimer)

              return (
                <div
                  key={row.id}
                  className={`card ${selected ? 'card-selected' : ''}`}
                  style={{ maxHeight: expanded ? '500px' : '80px' }}
                  onClick={() => toggleRow(row.id)}
                  onMouseDown={mostrarCheckBox ? handleMouseDown : undefined}
                  onMouseUp={mostrarCheckBox ? handleMouseUp : undefined}
                  onTouchStart={mostrarCheckBox ? handleMouseDown : undefined}
                  onTouchEnd={mostrarCheckBox ? handleMouseUp : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <div key={cell.id} style={{ opacity: expanded ? 1 : 1 }}>
                      <strong>{flexRender(cell.column.columnDef.header, cell.getContext())}:</strong>{' '}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="pagination">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              ◀
            </button>
            <span>
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              ▶
            </button>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>Mostrar {size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  /* =======================
     DESKTOP + ROW COLLAPSE
  ======================= */
  return (
    <div className="rt-card">
      <div className="rt-card-body">
        <h1>{tableTitle}</h1>
        <input
          className="searchInput"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />

        <table className="table">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {mostrarCheckBox && <th><input type="checkbox" disabled /></th>}
                {hg.headers.map(h => (
                  <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => {
              const expanded = expandedRows[row.id] || false
              const selected = selectedIds.has(row.original._id)

              return (
                <Fragment key={row.id}>
                  <tr onClick={() => isMobile && toggleRow(row.id)}
                      className={selected ? 'row-selected' : ''}>
                    {mostrarCheckBox && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelection(row.original._id)}
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>

                  {isMobile && expanded && (
                    <tr>
                      <td colSpan={columnas.length + (mostrarCheckBox ? 1 : 0)}
                          className="rowCollapseExpanded">
                        {row.getVisibleCells().map(cell => (
                          <div key={cell.id}>
                            <strong>{flexRender(cell.column.columnDef.header, cell.getContext())}:</strong>{' '}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            ◀
          </button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            ▶
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>Mostrar {size}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ReactTableTanstack