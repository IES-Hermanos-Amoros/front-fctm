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
  tableTitle = "",
  datos = [],
  columnas = [],
  mobileMode = 'card', // "collapse" | "card"
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [expandedRows, setExpandedRows] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cols = columnas.map(col => ({
    accessorKey: col.key,
    header: col.encabezado,
    cell: info => info.getValue(),
  }))

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

  const toggleRow = id =>
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }))

  /* =======================
     MOBILE - CARD MODE
  ======================= */
  if (isMobile && mobileMode === 'card') {
    return (
      <>
        <h1>{tableTitle}</h1>
        <input
          placeholder="Buscar..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="searchInput"
        />

        <div className="cardsContainer">
          {table.getRowModel().rows.map(row => {
            const expanded = expandedRows[row.id] || false
            return (
              <div
                key={row.id}
                className="card"
                style={{ maxHeight: expanded ? '500px' : '80px' }}
                onClick={() => toggleRow(row.id)}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <div
                    key={cell.id}
                    style={{ opacity: expanded ? 1 : i > 1 ? 0 : 1 }}
                  >
                    <strong>{columnas[i].encabezado}:</strong>{' '}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className="pagination">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            ◀ Anterior
          </button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente ▶
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      </>
    )
  }

  /* =======================
     TABLE (DESKTOP + COLLAPSE)
  ======================= */
  return (
    <>
      <h1>{tableTitle}</h1>
      <input
        placeholder="Buscar..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="searchInput"
      />

      <table className="table">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {isMobile && <th />}
              {hg.headers.map(h => (
                <th key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => {
            const expanded = expandedRows[row.id] || false
            return (
              <Fragment key={row.id}>
                <tr onClick={() => isMobile && toggleRow(row.id)}>
                  {isMobile && <td style={{ textAlign: 'center' }}>{expanded ? '−' : '+'}</td>}
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>

                {isMobile && expanded && (
                  <tr>
                    <td colSpan={columnas.length + 1} className="rowCollapseExpanded">
                      {row.getVisibleCells().map((cell, i) => (
                        <div key={cell.id}>
                          <strong>{columnas[i].encabezado}:</strong>{' '}
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
          ◀ Anterior
        </button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente ▶
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default ReactTableTanstack