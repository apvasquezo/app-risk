import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

type ExportEventData = Record<string, unknown>;

// Función utilitaria para formatear valores
const formatValue = (value: unknown, key: string): string => {
  if (value === null || value === undefined) return "";
  
  // Formateo de fechas
  if (key.toLowerCase().includes("fecha") && value) {
    const date = new Date(value as string);
    return isNaN(date.getTime()) ? String(value) : date.toLocaleString("es-CO");
  }
  
  // Formateo de moneda
  if (key.toLowerCase().includes("cuantia") && typeof value === "number") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }
  
  return String(value);
};

// Función para obtener todas las columnas únicas de los datos
const getAllColumns = (data: ExportEventData[]): string[] => {
  const columnsSet = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => columnsSet.add(key));
  });
  return Array.from(columnsSet);
};

// Función para preparar datos con mapeo dinámico de columnas
const prepareDataForExport = (
  data: ExportEventData[], 
  columnsToExport?: string[],
  columnMapping?: Record<string, string>
): Record<string, unknown>[] => {
  const columns = columnsToExport || getAllColumns(data);
  
  return data.map(item => {
    const exportItem: Record<string, unknown> = {};
    
    columns.forEach(column => {
      const displayName = columnMapping?.[column] || column;
      const value = item[column];
      exportItem[displayName] = formatValue(value, column);
    });
    
    return exportItem;
  });
};

// Función para exportar a Excel
export const exportToExcel = (
  data: ExportEventData[], 
  fileName: string,
  columnsToExport?: string[],
  columnMapping?: Record<string, string>
) => {
  const exportData = prepareDataForExport(data, columnsToExport, columnMapping);
  console.log("Datos preparados para exportar a Excel:", exportData);
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Ajustar ancho de columnas automáticamente
  const colWidths = Object.keys(exportData[0] || {}).map(key => ({
    wch: Math.max(key.length, 15) // Mínimo 15 caracteres de ancho
  }));
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Función para exportar a PDF
export const exportToPDF = (
  data: ExportEventData[], 
  fileName: string,
  columnsToExport?: string[],
  columnMapping?: Record<string, string>,
  pdfTitle: string = "Reporte de Datos"
) => {
  const columns = columnsToExport || getAllColumns(data);
  const displayColumns = columns.map(col => columnMapping?.[col] || col);
  
  const doc = new jsPDF();
  
  // Configurar encabezado
  doc.setFontSize(18);
  doc.text(pdfTitle, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generado el: ${dateStr}`, 14, 30);
  
  // Preparar datos para la tabla
  const tableRows = data.map(item => {
    return columns.map(column => {
      const value = item[column];
      return formatValue(value, column);
    });
  });
  
  // Crear tabla con autoTable
  autoTable(doc, {
    head: [displayColumns],
    body: tableRows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [78, 53, 73],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [78, 53, 73],
      textColor: [255, 255, 255],
      lineWidth: 0.1,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 255],
    },
    columnStyles: {
      // Ajustar ancho de columnas automáticamente
      ...Object.fromEntries(
        displayColumns.map((_, index) => [
          index, 
          { cellWidth: 'wrap', minCellWidth: 20 }
        ])
      )
    },
    margin: { top: 40 },
    theme: 'striped',
  });
  
  doc.save(`${fileName}.pdf`);
};