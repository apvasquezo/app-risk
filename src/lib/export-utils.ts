import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // solo importa para extender jsPDF (tipado ya está en .d.ts)

// ✅ Tipo genérico seguro para cada entrada de datos
type ExportEventData = Record<string, unknown>;

// Función para exportar a Excel
export const exportToExcel = (data: ExportEventData[], fileName: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Riesgos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Función para exportar a PDF
export const exportToPDF = (data: ExportEventData[], fileName: string, columns: string[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Listado de Riesgos", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generado el: ${dateStr}`, 14, 30);

  const tableColumn = columns;
  const tableRows = data.map((item) => {
    return columns.map((column) => {
      const value = item[column];
      if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
        if (column.toLowerCase().includes("fecha")) {
          return new Date(value as string).toLocaleString("es-CO");
        }
        if (column.toLowerCase().includes("cuantia")) {
          return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(Number(value));
        }
        return value.toString();
      }
      return "";
    });
  });

  doc.autoTable({
    head: [tableColumn],
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

  doc.save(`${fileName}.pdf`);
};

// Función para preparar los datos para exportación
export const prepareDataForExport = (eventEntries: ExportEventData[]) => {
  return eventEntries.map((entry) => {
    return {
      ID: entry["eventId"],
      "Fecha Inicio": entry["fechaInicio"]
        ? new Date(entry["fechaInicio"] as string).toLocaleString("es-CO")
        : "",
      "Fecha Final": entry["fechaFinal"]
        ? new Date(entry["fechaFinal"] as string).toLocaleString("es-CO")
        : "",
      "Fecha Descubrimiento": entry["fechaDescubrimiento"]
        ? new Date(entry["fechaDescubrimiento"] as string).toLocaleString("es-CO")
        : "",
      "Fecha Contabilización": entry["fechaContabilizacion"]
        ? new Date(entry["fechaContabilizacion"] as string).toLocaleString("es-CO")
        : "",
      Cuantía: entry["cuantia"] ? Number(entry["cuantia"]) : 0,
      "Cuantía Recuperada": entry["cuantiaRecuperada"] ? Number(entry["cuantiaRecuperada"]) : 0,
      "Cuantía Recuperada Seguros": entry["cuantiaRecuperadaSeguros"]
        ? Number(entry["cuantiaRecuperadaSeguros"])
        : 0,
      "Factor de Riesgo": entry["factorRiesgo"] ?? "",
      "Cuenta Contable": entry["cuentaContable"] ?? "",
      "Producto/Servicio": entry["productoServicio"] ?? "",
      Proceso: entry["proceso"] ?? "",
      Descripción: entry["descripcion"] ?? "",
      Canal: entry["canal"] ?? "",
      Ciudad: entry["ciudad"] ?? "",
      Responsable: entry["responsable"] ?? "",
      Estado: entry["estado"] ?? "",
    };
  });
};
