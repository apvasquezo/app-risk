"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF, prepareDataForExport } from "@/lib/export-utils";

// ✅ Tipado seguro para arreglos de objetos
interface ExportButtonsProps {
  data: Record<string, unknown>[];
  fileName?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ data, fileName = "riesgos-export" }) => {
  // Columnas para exportar a PDF
  const pdfColumns = [
    "ID",
    "Fecha Inicio",
    "Cuantía",
    "Factor de Riesgo",
    "Proceso",
    "Responsable",
    "Estado",
  ];

  const handleExportToExcel = () => {
    const exportData = prepareDataForExport(data);
    exportToExcel(exportData, fileName);
  };

  const handleExportToPDF = () => {
    const exportData = prepareDataForExport(data);
    exportToPDF(exportData, fileName, pdfColumns);
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
