import React from 'react'
import "./ReactTableToolBar.css"

const ReactTableToolBar = ({
    data = [],
    columns = [],
    // Para que el título del PDF y excel sea dinámico
    title = "Datos Tabla",
    filters = {},
    onFilterChange,
    filtersConfig = [],
    children
}) => {
    // Para normalizar el nombre del archivo (quitar espacios)
    const fileNameBase = title.replace(/\s+/g, '_')
    const exportExcel = async () => {
        //TO DO: Implementar exportación a Excel usando XLSX o similar
        // Hemos usado las librerías exceljs y file-saver para exportar a Excel. Asegúrate de instalarlas en tu proyecto:
        // INSTALACIÓN: npm i exceljs

        const ExcelJS = await import('exceljs')
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet(title) // Nombre de la pestaña dinámico
        // Para excluir los botones y acciones que no queremos exportar
        const excludedKeys = ['acciones', 'ver', 'eliminar']

        const validColumns = columns.filter(col =>
          col.key &&
          !excludedKeys.includes(col.key.toLowerCase()) &&
          !excludedKeys.includes((col.encabezado || "").toLowerCase())
        )
        // Mapeamos los encabezados y definimos un ancho base
        worksheet.columns = validColumns.map(col => ({
          header: col.encabezado || col.key || "Sin nombre",
          key: col.key,
          width: 30
        }))
        // Formateamos los datos para que se vean bien en Excel
        data.forEach(row => {
          const formattedRow = {}
          validColumns.forEach(col => {
            let value = row[col.key]
            // Si no hay valor directo, intentamos extraerlo de objetos relacionados (Empresas, Localidades, etc.)
            if (!value && row.empresa) {
                if (col.key.toLowerCase().includes("localidad")) {
                    value = row.empresa.SAO_company_city;
                } else if (col.key.toLowerCase().includes("empresa")) {
                    value = row.empresa.SAO_name;
                }
            }
            // Convertir datos en un Array (Categorías o aptitudes)
            if (Array.isArray(value)) {
                value = value.map(v => {
                    // Priorizamos extraer el nombre si es un objeto
                    if (typeof v === 'object' && v !== null) {
                        return v.FCTM_category_name || 
                              v.FCTM_skill_name || 
                              v.SAO_name || 
                              v.SAO_company_city || 
                              JSON.stringify(v); // Solo si no encontramos ninguna de las anteriores
                    }
                    return v; // Si ya es un texto o número, lo dejamos tal cual
                }).join(", ");
            // Convertir objetos a texto (Empresas, localidades, etc.)
            } else if(typeof value === "object" && value !== null) {
              if (col.key.toLowerCase().includes("empresa")) value = value.SAO_name
              else if (col.key.toLowerCase().includes("localidad")) value = value.SAO_company_city
              else value = value.FCTM_category_name || value.FCTM_skill_name || JSON.stringify(value)
            }
            // Formatear fechas 
            if (value && (typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value)))){
              const date = new Date(value)
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()
              value = `${day}/${month}/${year}`
            }
            formattedRow[col.key] = value ?? ""
          })
          worksheet.addRow(formattedRow)
        })
        // Estilos de encabezado
        const headerRow = worksheet.getRow(1);
        headerRow.height = 25

        headerRow.eachCell(cell => {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F4E78'} // Azul oscuro
          }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'medium', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          }
        })
        // Aplicación de estilos a las filas de datos
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) { 
            row.alignment = { wrapText: true, vertical: 'middle' }
            row.height = 20 
            // Efecto cebra para las filas pares
            if (rowNumber % 2 === 0) {
                row.eachCell(cell => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF2F2F2' } // Gris muy clarito
                    }
                })
            }
            // Añadir bordes finos a todas las celdas de datos
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'hair' },
                    left: { style: 'hair' },
                    bottom: { style: 'hair' },
                    right: { style: 'hair' }
                }
            })
        }
    })
        // Descargar el archivo - Creamos el buffer y disparamos la descarga en el navegador
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        // Link
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${fileNameBase}_${new Date().getTime()}.xlsx`
        link.click()
        URL.revokeObjectURL(link.href)
      }
    
    const exportPDF = async () => {
        //TO DO: Implementar exportación a PDF usando jspdf y jspdf-autotable o similar
        // INSTALACIÓN: npm i pdfmake
        const pdfMake = (await import('pdfmake/build/pdfmake')).default
        const pdfFonts = await import('pdfmake/build/vfs_fonts')
        pdfMake.vfs = pdfFonts.vfs

        // Definir columnas que no queremos poner en el PDF
        const excludedKeys = ['acciones', 'ver', 'eliminar']

        const validColumns = columns.filter(col =>
          col.key && !excludedKeys.includes(col.key.toLowerCase()) &&
          !excludedKeys.includes(col.encabezado?.toLowerCase())
        )
        // Encabezados
        const headers = validColumns.map(col => col.encabezado || col.key || "Sin nombre")
        // Filas
        const rows = data.map(row =>
          validColumns.map(col => {
              let value = row[col.key]
              // Si no hay valor directo, intentamos extraerlo de objetos relacionados (Empresas, Localidades, etc.)
              if (!value && row.empresa) {
                if (col.key.toLowerCase().includes("localidad")) {
                    value = row.empresa.SAO_company_city;
                } else if (col.key.toLowerCase().includes("empresa")) {
                    value = row.empresa.SAO_name;
                }
              }
              // Convertir arrays y objetos a texto
              if(Array.isArray(value)){
                value = value.map(v => v.FCTM_category_name || v.FCTM_skill_name || v.SAO_company_city || v.SAO_name || (typeof v === "object" ? JSON.stringify(v) : v)).join(", ")
              } else if (typeof value === "object" && value !== null) {
                if (col.key.toLowerCase().includes("empresa")) value = value.SAO_name
                else if (col.key.toLowerCase().includes("localidad")) value = value.SAO_company_city
                else value = value.FCTM_category_name || value.FCTM_skill_name || JSON.stringify(value)
            }
              // Formatear fechas    
              if (value && typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))) {
                  const date = new Date(value)
                  const day = String(date.getDate()).padStart(2, '0')
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const year = date.getFullYear()
                  value = `${day}/${month}/${year}`
              }        
              return value?.toString() ?? ""
            })
        )
        // Definición del documento
        const docDefinition = {
          pageOrientation: "landscape",
          pageSize: "A4",
          pageMargins: [20,40,20,40],
          content: [
            {
              columns: [
                { text: `${title.toUpperCase()}`, style: "header"},
                { text: "IES Hermanos Amorós", style: "subheader", alignment: "right"}
              ],
              margin: [0,0,0,20]
            },
            {
              table: {
                headerRows: 1,
                widths: headers.map(() => 'auto'),
                body: [headers.map(h => ({ text: h, style: 'tableHeader' })), ...rows]
              },
              // Líneas de la tabla
              layout: {
                fillColor: (rowIndex) => {
                  if (rowIndex === 0) return '#1F4E78'; // Azul Marino para el cabezal
                  return (rowIndex % 2 === 0) ? '#F8F9FA' : null; // Cebra: gris muy clarito en filas pares
                },
                hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5, 
                vLineWidth: () => 0.5,
                hLineColor: (i) => (i === 0 || i === 1) ? '#1F4E78' : '#AAAAAA',
                vLineColor: () => '#EEEEEE',
              }
            }
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              color: '#1F4E78'
            },
            subheader: {
              fontSize: 12,
              bold: true,
              color: '#666666'
            },
            tableHeader: {
              bold: true,
              fontSize: 8,
              color: 'white',
              margin: [0, 5, 0, 5]
            }
          },
          defaultStyle: {
            fontSize: 7,
            color: '#333333'
          }
        }
        // Descargar el PDF
        pdfMake.createPdf(docDefinition).download(`${fileNameBase}_${new Date().getTime()}.pdf`)
    }
  return (
    <div className='react-table-toolbar'>
      {/* IZQUIERDA */}
      <div className="toolbar-actions">
          {children || <div></div>} {/* El div vacío ayuda a mantener el equilibrio si no hay children */}
      </div>
      {/* Filtros dinámicos */}
      <div className="toolbar-filters">
        {filtersConfig?.map(filter => (
          <select
            key={filter.key}
            className="form-select"
            value={filters[filter.key] || ""}
            onChange={(e) =>
              onFilterChange?.(prev => ({
                ...prev,
                [filter.key]: e.target.value
              }))
            }
          >
            <option value="">Todos - {filter.label}</option>

            {filter.options?.map(opt => (
              <option
                key={opt[filter.optionValue]}
                value={opt[filter.optionValue]}
              >
                {opt[filter.optionLabel]}
              </option>
            ))}
          </select>
        ))}
      </div>
      {/* DERECHA */}
      <div className="toolbar-export-buttons">
        {/* Botones de exportación */}
        <button className='toolbar-btn excel-btn' onClick={exportExcel}>Exportar Excel</button>
        <button className='toolbar-btn pdf-btn' onClick={exportPDF}>Exportar PDF</button>
      </div>
    </div>
  )
}

export default ReactTableToolBar