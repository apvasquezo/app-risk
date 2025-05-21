import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import type autoTable from "jspdf-autotable"

// Tipo para la tabla de jsPDF-autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

// Función para exportar a Excel
export const exportToExcel = (data: any[], fileName: string) => {
  // Crear un libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Convertir los datos a una hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Riesgos")

  // Generar el archivo y descargarlo
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

// Función para exportar a PDF
export const exportToPDF = (data: any[], fileName: string, columns: string[]) => {
  // Crear un nuevo documento PDF
  const doc = new jsPDF()

  // Añadir título
  doc.setFontSize(18)
  doc.text("Listado de Riesgos", 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)

  // Fecha actual
  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.text(`Generado el: ${dateStr}`, 14, 30)

  // Preparar los datos para la tabla
  const tableColumn = columns
  const tableRows = data.map((item) => {
    return columns.map((column) => {
      // Formatear fechas si es necesario
      if (column.includes("fecha") && item[column]) {
        return new Date(item[column]).toLocaleString("es-CO")
      }
      // Formatear moneda si es necesario
      if (column.includes("cuantia") && item[column]) {
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(Number(item[column]))
      }
      return item[column]?.toString() || ""
    })
  })

  // Generar la tabla
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [78, 53, 73], // Color violeta para las líneas
    },
    headStyles: {
      fillColor: [78, 53, 73], // Color violeta para el encabezado
      textColor: [255, 255, 255],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 255], // Color de fondo para filas alternas
    },
    margin: { top: 40 },
  })

  // Guardar el PDF
  doc.save(`${fileName}.pdf`)
}

// Función para preparar los datos para exportación
export const prepareDataForExport = (eventEntries: any[]) => {
  return eventEntries.map((entry) => {
    // Crear un nuevo objeto con los datos formateados
    return {
      ID: entry.eventId,
      "Fecha Inicio": entry.fechaInicio ? new Date(entry.fechaInicio).toLocaleString("es-CO") : "",
      "Fecha Final": entry.fechaFinal ? new Date(entry.fechaFinal).toLocaleString("es-CO") : "",
      "Fecha Descubrimiento": entry.fechaDescubrimiento
        ? new Date(entry.fechaDescubrimiento).toLocaleString("es-CO")
        : "",
      "Fecha Contabilización": entry.fechaContabilizacion
        ? new Date(entry.fechaContabilizacion).toLocaleString("es-CO")
        : "",
      Cuantía: entry.cuantia ? Number(entry.cuantia) : 0,
      "Cuantía Recuperada": entry.cuantiaRecuperada ? Number(entry.cuantiaRecuperada) : 0,
      "Cuantía Recuperada Seguros": entry.cuantiaRecuperadaSeguros ? Number(entry.cuantiaRecuperadaSeguros) : 0,
      "Factor de Riesgo": entry.factorRiesgo || "",
      "Cuenta Contable": entry.cuentaContable || "",
      "Producto/Servicio": entry.productoServicio || "",
      Proceso: entry.proceso || "",
      Descripción: entry.descripcion || "",
      Canal: entry.canal || "",
      Ciudad: entry.ciudad || "",
      Responsable: entry.responsable || "",
      Estado: entry.estado || "",
    }
  })
}
