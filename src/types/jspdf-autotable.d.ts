import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

type ExportEventData = Record<string, unknown>;

interface PDFExportOptions {
  data: ExportEventData[];
  fileName: string;
  columnsToExport?: string[];
  columnMapping?: Record<string, string>;
  pdfTitle?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'a3' | 'letter';
  customStyles?: {
    headerColor?: [number, number, number];
    alternateRowColor?: [number, number, number];
    fontSize?: number;
    headerFontSize?: number;
  };
}

// Función utilitaria para formatear valores específicamente para PDF
const formatValueForPDF = (value: unknown, key: string): string => {
  if (value === null || value === undefined) return "";
  
  // Formateo de fechas
  if (key.toLowerCase().includes("fecha") && value) {
    const date = new Date(value as string);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }
  
  // Formateo de moneda (más compacto para PDF)
  if (key.toLowerCase().includes("cuantia") && typeof value === "number") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  // Truncar texto muy largo para PDF
  const stringValue = String(value);
  if (stringValue.length > 50) {
    return stringValue.substring(0, 47) + "...";
  }
  
  return stringValue;
};

// Función para obtener todas las columnas únicas de los datos
const getAllColumns = (data: ExportEventData[]): string[] => {
  const columnsSet = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => columnsSet.add(key));
  });
  return Array.from(columnsSet);
};

// Función para calcular el ancho óptimo de columnas
const calculateColumnWidths = (
  columns: string[], 
  displayColumns: string[],
  data: ExportEventData[], 
  pageWidth: number
): Record<number, { cellWidth: number }> => {
  const totalColumns = columns.length;
  const availableWidth = pageWidth - 28; // Margen de 14 a cada lado
  
  // Calcular ancho mínimo basado en el texto del encabezado
  const getMinWidthForHeader = (headerText: string): number => {
    // Aproximadamente 2mm por caracter + padding
    const textWidth = headerText.length * 2;
    return Math.max(textWidth + 8, 25); // Mínimo 25mm
  };
  
  // Calcular ancho base
  let baseWidth = availableWidth / totalColumns;
  
  // Ajustar según el tipo de columna y longitud del encabezado
  const columnStyles: Record<number, { cellWidth: number }> = {};
  
  columns.forEach((column, index) => {
    const displayName = displayColumns[index];
    let width = baseWidth;
    const minWidthForHeader = getMinWidthForHeader(displayName);
    
    // Columnas de ID más angostas pero respetando el encabezado
    if (column.toLowerCase().includes('id') || column.toLowerCase().includes('codigo')) {
      width = Math.max(minWidthForHeader, 30);
    }
    // Columnas de fecha
    else if (column.toLowerCase().includes('fecha')) {
      width = Math.max(minWidthForHeader, 35);
    }
    // Columnas de cuantía
    else if (column.toLowerCase().includes('cuantia')) {
      width = Math.max(minWidthForHeader, 40);
    }
    // Columnas de descripción más anchas
    else if (column.toLowerCase().includes('descripcion') || column.toLowerCase().includes('observacion')) {
      width = Math.max(minWidthForHeader, 60);
    }
    // Para el resto, usar el mínimo calculado
    else {
      width = Math.max(minWidthForHeader, baseWidth);
    }
    
    columnStyles[index] = { cellWidth: width };
  });
  
  // Verificar si el total excede el ancho disponible y ajustar proporcionalmente
  const totalWidth = Object.values(columnStyles).reduce((sum, style) => sum + style.cellWidth, 0);
  if (totalWidth > availableWidth) {
    const scaleFactor = availableWidth / totalWidth;
    Object.keys(columnStyles).forEach(key => {
      const index = parseInt(key);
      const minWidth = getMinWidthForHeader(displayColumns[index]);
      columnStyles[index].cellWidth = Math.max(
        columnStyles[index].cellWidth * scaleFactor,
        minWidth
      );
    });
  }
  
  return columnStyles;
};

// Función principal de exportación a PDF dinámica
export const exportToPDFDynamic = ({
  data,
  fileName,
  columnsToExport,
  columnMapping,
  pdfTitle = "Reporte de Datos",
  orientation = 'landscape', // Por defecto landscape para más columnas
  pageSize = 'a4',
  customStyles = {}
}: PDFExportOptions) => {
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  // Determinar columnas a exportar
  const columns = columnsToExport || getAllColumns(data);
  const displayColumns = columns.map(col => columnMapping?.[col] || col);
  
  // Crear documento PDF
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Configurar encabezado
  doc.setFontSize(customStyles.headerFontSize || 16);
  doc.text(pdfTitle, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.text(`Generado el: ${dateStr}`, 14, 28);
  doc.text(`Total de registros: ${data.length}`, 14, 34);
  
  // Preparar datos para la tabla
  const tableRows = data.map(item => {
    return columns.map(column => {
      const value = item[column];
      return formatValueForPDF(value, column);
    });
  });
  
  // Calcular anchos de columna
  const columnStyles = calculateColumnWidths(columns, displayColumns, data, pageWidth);
  
  // Configurar estilos
  const defaultHeaderColor: [number, number, number] = [78, 53, 73];
  const defaultAlternateColor: [number, number, number] = [245, 245, 255];
  
  // Crear tabla con autoTable
  autoTable(doc, {
    head: [displayColumns],
    body: tableRows,
    startY: 42,
    styles: {
      fontSize: customStyles.fontSize || 8,
      cellPadding: 2,
      lineColor: [78, 53, 73],
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
    },
    headStyles: {
      fillColor: customStyles.headerColor || defaultHeaderColor,
      textColor: [255, 255, 255],
      lineWidth: 0.1,
      fontSize: (customStyles.fontSize || 8) + 1,
      fontStyle: 'bold',
      halign: 'center',
      overflow: 'visible', // Evitar que el texto se corte en los encabezados
      minCellHeight: 12, // Altura mínima para encabezados
    },
    alternateRowStyles: {
      fillColor: customStyles.alternateRowColor || defaultAlternateColor,
    },
    columnStyles,
    margin: { top: 42, left: 14, right: 14 },
    theme: 'striped',
    showHead: 'everyPage',
    
    // Hook para agregar información en cada página
    didDrawPage: (data) => {
      // Pie de página
      const pageNum = data.pageNumber;
      const totalPages = (doc as any).internal.getNumberOfPages();
      
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Página ${pageNum} de ${totalPages}`,
        pageWidth - 30,
        pageHeight - 10
      );
    },
    
    // Hook para personalizar celdas específicas
    willDrawCell: (data) => {
      // Destacar ciertas columnas (ej: estados críticos)
      if (data.section === 'body' && data.column.index !== undefined) {
        const columnName = columns[data.column.index];
        const cellValue = String(data.cell.raw);
        
        // Ejemplo: destacar estados críticos en rojo
        if (columnName.toLowerCase().includes('estado') && 
            ['crítico', 'vencido', 'alto'].some(term => 
              cellValue.toLowerCase().includes(term))) {
          data.cell.styles.textColor = [255, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        }
        
        // Ejemplo: destacar montos altos
        if (columnName.toLowerCase().includes('cuantia') && 
            cellValue.includes('$') && 
            parseFloat(cellValue.replace(/[^\d]/g, '')) > 1000000) {
          data.cell.styles.textColor = [0, 100, 0];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });
  
  // Agregar metadatos al PDF
  doc.setProperties({
    title: pdfTitle,
    subject: `Reporte generado el ${new Date().toLocaleDateString('es-CO')}`,
    author: 'Sistema de Reportes',
    creator: 'Exportador PDF Dinámico'
  });
  
  // Guardar el archivo
  doc.save(`${fileName}.pdf`);
  
  console.log(`PDF exportado: ${fileName}.pdf con ${data.length} registros y ${columns.length} columnas`);
};

// Función wrapper para mantener compatibilidad con el código existente
export const exportToPDF = (
  data: ExportEventData[], 
  fileName: string,
  columnsToExport?: string[],
  columnMapping?: Record<string, string>,
  pdfTitle: string = "Reporte de Datos"
) => {
  exportToPDFDynamic({
    data,
    fileName,
    columnsToExport,
    columnMapping,
    pdfTitle
  });
};