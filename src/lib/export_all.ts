import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

type ExportData = Record<string, unknown>;

interface ExportConfig {
  fileName: string;
  title?: string;
  dateColumns?: string[]; // Columnas que contienen fechas
  currencyColumns?: string[]; // Columnas que contienen moneda
  customFormatters?: Record<string, (value: unknown) => string>; // Formateadores personalizados
}

type ColumnMapper<T = ExportData> = (item: T) => unknown;
type ColumnMapping<T = ExportData> = Record<string, string | ColumnMapper<T>>;

// Función genérica para exportar a Excel
export const exportToExcel = (data: ExportData[], config: ExportConfig): void => {
  console.log("Exportando a Excel:", data);
  
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, config.title || "Datos");
  XLSX.writeFile(workbook, `${config.fileName}.xlsx`);
};

// Función genérica para exportar a PDF
export const exportToPDF = (data: ExportData[], config: ExportConfig): void => {
  console.log("Exportando a PDF:", data);
  
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const doc = new jsPDF();
  
  // Configurar encabezado
  doc.setFontSize(18);
  doc.text(config.title || "Reporte de Datos", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generado el: ${dateStr}`, 14, 30);

  // Obtener columnas dinámicamente del primer objeto
  const columns = Object.keys(data[0]);
  
  // Preparar datos para la tabla
  const tableRows = data.map((item) => {
    return columns.map((column) => {
      const value = item[column];
      return formatCellValue(value, column, config);
    });
  });

  autoTable(doc, {
    head: [columns],
    body: tableRows,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [78, 53, 73],
    },
    headStyles: {
      fillColor: [78, 53, 73],
      textColor: [255, 255, 255],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 255],
    },
    margin: { top: 40 },
  });

  doc.save(`${config.fileName}.pdf`);
};

// Función auxiliar para formatear valores de celda
const formatCellValue = (value: unknown, columnName: string, config: ExportConfig): string => {
  if (value == null || value === undefined) {
    return "";
  }

  // Aplicar formateador personalizado si existe
  if (config.customFormatters && config.customFormatters[columnName]) {
    return config.customFormatters[columnName](value);
  }

  // Formatear fechas
  if (config.dateColumns?.some(col => columnName.toLowerCase().includes(col.toLowerCase()))) {
    return formatDate(value);
  }

  // Formatear moneda
  if (config.currencyColumns?.some(col => columnName.toLowerCase().includes(col.toLowerCase()))) {
    return formatCurrency(value);
  }

  // Formatear fechas automáticamente basado en el nombre de la columna
  if (columnName.toLowerCase().includes("fecha")) {
    return formatDate(value);
  }

  // Formatear moneda automáticamente basado en el nombre de la columna
  if (columnName.toLowerCase().includes("cuantia") || 
      columnName.toLowerCase().includes("precio") || 
      columnName.toLowerCase().includes("valor")) {
    return formatCurrency(value);
  }

  return String(value);
};

// Función auxiliar para formatear fechas de forma segura
const formatDate = (value: unknown): string => {
  try {
    if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return String(value);
      }
      return date.toLocaleString("es-CO");
    }
    return String(value);
  } catch {
    return String(value);
  }
};

// Función auxiliar para formatear moneda de forma segura
const formatCurrency = (value: unknown): string => {
  try {
    const numValue = typeof value === 'number' ? value : Number(value);
    if (isNaN(numValue)) {
      return String(value);
    }
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(numValue);
  } catch {
    return String(value);
  }
};

// Función auxiliar para exportar en ambos formatos
export const exportData = async (
  data: ExportData[], 
  format: 'excel' | 'pdf' | 'both', 
  config: ExportConfig
): Promise<void> => {
  try {
    switch (format) {
      case 'excel':
        exportToExcel(data, config);
        break;
      case 'pdf':
        exportToPDF(data, config);
        break;
      case 'both':
        exportToExcel(data, config);
        exportToPDF(data, config);
        break;
      default:
        throw new Error('Formato no válido. Use: excel, pdf o both');
    }
    console.log(`Exportación ${format} completada exitosamente`);
  } catch (error) {
    console.error('Error durante la exportación:', error);
    throw error;
  }
};

// Función genérica para preparar datos con mapeo de columnas personalizado
export const prepareDataWithMapping = <T extends Record<string, unknown>>(
  data: T[], 
  columnMapping: ColumnMapping<T>
): ExportData[] => {
  return data.map((item) => {
    const mappedItem: ExportData = {};
    
    Object.entries(columnMapping).forEach(([newKey, mapping]) => {
      if (typeof mapping === 'string') {
        // Mapeo simple de columna
        mappedItem[newKey] = item[mapping] ?? "";
      } else if (typeof mapping === 'function') {
        // Mapeo con función personalizada
        mappedItem[newKey] = mapping(item);
      }
    });
    
    return mappedItem;
  });
};

// Type guard para verificar si un valor es una fecha válida
export const isValidDate = (value: unknown): value is Date | string | number => {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value === 'string' || typeof value === 'number') {
    return !isNaN(new Date(value).getTime());
  }
  return false;
};

// Type guard para verificar si un valor es numérico
export const isNumeric = (value: unknown): value is number | string => {
  return typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));
};