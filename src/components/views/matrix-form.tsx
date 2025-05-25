"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_prueba/card"
import { Button } from "@/components/ui_prueba/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

// Definimos los datos para las matrices de riesgo
const riskLevels = ["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
const impactLevels = ["Insignificante", "Menor", "Moderado", "Mayor", "Catastrófico"]

// Datos para el mapa de calor de riesgo inherente
const inherentRiskData = [
  // Formato: [probabilidad, impacto, valor]
  [0, 0, 1],
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 5],
  [1, 0, 2],
  [1, 1, 3],
  [1, 2, 4],
  [1, 3, 5],
  [1, 4, 8],
  [2, 0, 3],
  [2, 1, 4],
  [2, 2, 6],
  [2, 3, 8],
  [2, 4, 10],
  [3, 0, 4],
  [3, 1, 5],
  [3, 2, 8],
  [3, 3, 10],
  [3, 4, 15],
  [4, 0, 5],
  [4, 1, 8],
  [4, 2, 10],
  [4, 3, 15],
  [4, 4, 20],
]

// Datos para el mapa de calor de riesgo residual (después de controles)
const residualRiskData = [
  [0, 0, 1],
  [0, 1, 1],
  [0, 2, 2],
  [0, 3, 3],
  [0, 4, 4],
  [1, 0, 1],
  [1, 1, 2],
  [1, 2, 3],
  [1, 3, 4],
  [1, 4, 6],
  [2, 0, 2],
  [2, 1, 3],
  [2, 2, 4],
  [2, 3, 6],
  [2, 4, 8],
  [3, 0, 3],
  [3, 1, 4],
  [3, 2, 6],
  [3, 3, 8],
  [3, 4, 12],
  [4, 0, 4],
  [4, 1, 6],
  [4, 2, 8],
  [4, 3, 12],
  [4, 4, 16],
]

// Lista de riesgos identificados para exportar
const risksList = [
  {
    id: "R-001",
    nombre: "Fraude interno",
    probabilidadInherente: "Alto",
    impactoInherente: "Mayor",
    valorInherente: 10,
    probabilidadResidual: "Medio",
    impactoResidual: "Moderado",
    valorResidual: 6,
  },
  {
    id: "R-002",
    nombre: "Falla en sistemas críticos",
    probabilidadInherente: "Medio",
    impactoInherente: "Catastrófico",
    valorInherente: 10,
    probabilidadResidual: "Bajo",
    impactoResidual: "Mayor",
    valorResidual: 4,
  },
  {
    id: "R-003",
    nombre: "Incumplimiento regulatorio",
    probabilidadInherente: "Alto",
    impactoInherente: "Catastrófico",
    valorInherente: 15,
    probabilidadResidual: "Medio",
    impactoResidual: "Mayor",
    valorResidual: 8,
  },
  {
    id: "R-004",
    nombre: "Pérdida de información confidencial",
    probabilidadInherente: "Medio",
    impactoInherente: "Mayor",
    valorInherente: 8,
    probabilidadResidual: "Bajo",
    impactoResidual: "Moderado",
    valorResidual: 3,
  },
  {
    id: "R-005",
    nombre: "Interrupción de operaciones",
    probabilidadInherente: "Alto",
    impactoInherente: "Mayor",
    valorInherente: 10,
    probabilidadResidual: "Medio",
    impactoResidual: "Moderado",
    valorResidual: 6,
  },
]

// Componente para el mapa de calor
const HeatMapRisk = ({ data, title }: { data: number[][]; title: string }) => {
  // Función para determinar el color según el valor de riesgo
  const getColor = (value: number) => {
    if (value <= 3) return "bg-green-500" // Bajo
    if (value <= 6) return "bg-yellow-500" // Medio
    if (value <= 12) return "bg-orange-500" // Alto
    return "bg-red-500" // Crítico
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="relative">
        {/* Etiquetas del eje Y (Probabilidad) */}
        <div className="absolute -left-24 top-0 h-full flex flex-col justify-between">
          {riskLevels.map((level, index) => (
            <div key={index} className="text-xs text-right pr-2 h-10 flex items-center justify-end">
              {level}
            </div>
          ))}
        </div>

        {/* Matriz de riesgo */}
        <div className="ml-2">
          <div className="grid grid-cols-5 gap-1">
            {data.map((cell, index) => {
              const [y, x, value] = cell
              return (
                <div
                  key={index}
                  className={`${getColor(value)} h-10 flex items-center justify-center text-white font-bold rounded`}
                  title={`Probabilidad: ${riskLevels[y]}, Impacto: ${impactLevels[x]}, Valor: ${value}`}
                >
                  {value}
                </div>
              )
            })}
          </div>

          {/* Etiquetas del eje X (Impacto) */}
          <div className="grid grid-cols-5 gap-1 mt-2">
            {impactLevels.map((level, index) => (
              <div key={index} className="text-xs text-center">
                {level}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MatrizRiesgo() {
  // Función para exportar a Excel
  const exportToExcel = () => {
    // Crear una hoja de cálculo con los datos
    const worksheet = XLSX.utils.json_to_sheet(risksList)

    // Ajustar el ancho de las columnas
    const columnWidths = [
      { wch: 10 }, // ID
      { wch: 30 }, // Nombre
      { wch: 20 }, // Probabilidad Inherente
      { wch: 20 }, // Impacto Inherente
      { wch: 15 }, // Valor Inherente
      { wch: 20 }, // Probabilidad Residual
      { wch: 20 }, // Impacto Residual
      { wch: 15 }, // Valor Residual
    ]
    worksheet["!cols"] = columnWidths

    // Crear un libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Matriz de Riesgos")

    // Guardar el archivo
    XLSX.writeFile(workbook, "matriz-de-riesgos.xlsx")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-violet-900">Matriz de Riesgo</h1>
        <Button onClick={exportToExcel} className="bg-violet-900 hover:bg-orange-500 text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar a Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-t-4 border-orange-500 shadow-lg">
          <CardHeader>
            <CardTitle>Riesgo Inherente</CardTitle>
          </CardHeader>
          <CardContent className="pl-24">
            <HeatMapRisk data={inherentRiskData} title="Probabilidad vs Impacto (Inherente)" />
          </CardContent>
        </Card>

        <Card className="border-t-4 border-violet-500 shadow-lg">
          <CardHeader>
            <CardTitle>Riesgo Residual</CardTitle>
          </CardHeader>
          <CardContent className="pl-24">
            <HeatMapRisk data={residualRiskData} title="Probabilidad vs Impacto (Residual)" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-t-4 border-green-500 shadow-lg">
        <CardHeader>
          <CardTitle>Listado de Riesgos Identificados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-violet-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                  <th className="border border-gray-300 px-4 py-2 text-center" colSpan={3}>
                    Riesgo Inherente
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center" colSpan={3}>
                    Riesgo Residual
                  </th>
                </tr>
                <tr className="bg-violet-50">
                  <th className="border border-gray-300 px-4 py-2"></th>
                  <th className="border border-gray-300 px-4 py-2"></th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Probabilidad</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Impacto</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Valor</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Probabilidad</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Impacto</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Valor</th>
                </tr>
              </thead>
              <tbody>
                {risksList.map((risk) => (
                  <tr key={risk.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{risk.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{risk.nombre}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.probabilidadInherente === "Alto" || risk.probabilidadInherente === "Muy Alto"
                            ? "bg-red-100 text-red-800"
                            : risk.probabilidadInherente === "Medio"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.probabilidadInherente}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.impactoInherente === "Mayor" || risk.impactoInherente === "Catastrófico"
                            ? "bg-red-100 text-red-800"
                            : risk.impactoInherente === "Moderado"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.impactoInherente}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.valorInherente > 12
                            ? "bg-red-100 text-red-800"
                            : risk.valorInherente > 6
                              ? "bg-orange-100 text-orange-800"
                              : risk.valorInherente > 3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.valorInherente}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.probabilidadResidual === "Alto" || risk.probabilidadResidual === "Muy Alto"
                            ? "bg-red-100 text-red-800"
                            : risk.probabilidadResidual === "Medio"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.probabilidadResidual}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.impactoResidual === "Mayor" || risk.impactoResidual === "Catastrófico"
                            ? "bg-red-100 text-red-800"
                            : risk.impactoResidual === "Moderado"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.impactoResidual}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.valorResidual > 12
                            ? "bg-red-100 text-red-800"
                            : risk.valorResidual > 6
                              ? "bg-orange-100 text-orange-800"
                              : risk.valorResidual > 3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {risk.valorResidual}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
