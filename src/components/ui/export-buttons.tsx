"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

interface ExportButtonsProps {
  data: Record<string, unknown>[];
  fileName?: string;
  // Opcional: mapeo personalizado de columnas para el PDF
  columnMapping?: Record<string, string>;
  // Opcional: columnas específicas para exportar (si no se especifica, exporta todas)
  columnsToExport?: string[];
  // Opcional: título personalizado para el PDF
  pdfTitle?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  data, 
  fileName = "export-data",
  columnMapping,
  columnsToExport,
  pdfTitle = "Reporte de Datos"
}) => {
  const handleExportToExcel = () => {
    exportToExcel(data, fileName, columnsToExport, columnMapping);
  };

  const handleExportToPDF = () => {
    exportToPDF(data, fileName, columnsToExport, columnMapping, pdfTitle);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportToExcel}
        variant="outline"
        className="text-green-600 border-green-600 hover:bg-green-50"
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Exportar a Excel
      </Button>
      <Button
        onClick={handleExportToPDF}
        variant="outline"
        className="text-red-600 border-red-600 hover:bg-red-50"
      >
        <FileText className="w-4 h-4 mr-2" />
        Exportar a PDF
      </Button>
    </div>
  );
};