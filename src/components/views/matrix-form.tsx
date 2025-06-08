"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"
import * as XLSX from "xlsx"

// Definimos los datos para las matrices de riesgo
const riskLevels = ["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
const impactLevels = ["Insignificante", "Menor", "Moderado", "Mayor", "Catastrófico"]

// Función para obtener el valor de riesgo según probabilidad e impacto
// Esta matriz debe coincidir con la que se muestra visualmente
const getRiskValue = (probability: number, impact: number): number => {
  // Matriz de riesgo estándar: Probabilidad (filas) x Impacto (columnas)
  // Los índices van de 0-4 para ambos ejes
  const riskMatrix = [
    // Prob\Imp  Insignif  Menor  Moderado  Mayor  Catastrófico
    [1, 2, 3, 4, 5],      // Muy Bajo (0)
    [2, 4, 6, 8, 10],     // Bajo (1)
    [3, 6, 9, 12, 15],    // Medio (2)
    [4, 8, 12, 16, 20],   // Alto (3)
    [5, 10, 15, 20, 25]   // Muy Alto (4)
  ]
  
  // Validar que los índices estén en el rango correcto
  if (probability < 0 || probability > 4 || impact < 0 || impact > 4) {
    console.warn(`Índices fuera de rango: prob=${probability}, imp=${impact}`)
    return 1
  }
  
  return riskMatrix[probability][impact]
}

interface RiskInherente {
  id_event:number
  description: string
  probability_id: number
  impact_id: number
}

interface TransformedRisk {
  probability: number
  impact: number
  description: string
  value: number
}

interface RiskResidual {
  eventlog_id: number
  n_probability: number
  n_impact: number
}


// Componente para el mapa de calor con riesgos ubicados
const HeatMapRisk = ({ 
  title, 
  risks = [] 
}: { 
  title: string
  risks?: TransformedRisk[]
}) => {
  // Función para determinar el color según el valor de riesgo
  const getColor = (value: number) => {
    if (value <= 5) return "bg-green-500" // Bajo
    if (value <= 10) return "bg-yellow-500" // Medio
    if (value <= 15) return "bg-orange-500" // Alto
    return "bg-red-500" // Crítico
  }

  // Contar cuántos riesgos hay en cada celda
  const getRisksInCell = (probability: number, impact: number) => {
    const risksInCell = risks.filter(risk => 
      risk.probability === probability && risk.impact === impact
    )
    return risksInCell
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="relative">
        {/* Etiquetas del eje Y (Probabilidad) */}
        <div className="absolute -left-24 top-0 h-full flex flex-col justify-between">
          {[...riskLevels].reverse().map((level, index) => (
            <div key={index} className="text-xs text-right pr-2 h-12 flex items-center justify-end">
              {level}
            </div>
          ))}
        </div>

        {/* Matriz de riesgo */}
        <div className="ml-2">
          <div className="grid grid-cols-5 gap-1">
            {/* Reorganizar para mostrar correctamente (probabilidad de mayor a menor) */}
            {[4, 3, 2, 1, 0].map((probIndex) =>
              [0, 1, 2, 3, 4].map((impIndex) => {
                const value = getRiskValue(probIndex, impIndex)
                const risksInCell = getRisksInCell(probIndex, impIndex)
                const key = `${probIndex}-${impIndex}`
                
                return (
                  <div
                    key={key}
                    className={`${getColor(value)} h-12 flex flex-col items-center justify-center text-white font-bold rounded relative`}
                    title={`Probabilidad: ${riskLevels[probIndex]}, Impacto: ${impactLevels[impIndex]}, Valor: ${value}${
                      risksInCell.length > 0 ? 
                      `\nRiesgos: ${risksInCell.map(r => r.description).join(', ')}` : 
                      ''
                    }`}
                  >
                    <span className="text-sm">{value}</span>
                    {risksInCell.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-white text-black border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {risksInCell.length}
                      </div>
                    )}
                  </div>
                )
              })
            )}
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
  const { toast } = useToast()
  const [inherenteList, setInherenteList] = useState<RiskInherente[]>([])
  const [residualList, SetResidualList] = useState <RiskResidual[]>([])

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const responseIn = await api.get("/dashboard/inherente")
        setInherenteList(responseIn.data)
        console.log("Inherente del backend ", responseIn.data)
        const responseRe = await api.get("/dashboard/residual")
        SetResidualList(responseRe.data)
        console.log("Residual del backend ", responseRe.data)        
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudo obtener los listados.",
        })
      }
    }
    fetchMatrix()
  }, [])

  // Transformar los datos del backend para ubicar en la matriz
  const transformedRisks = useMemo((): TransformedRisk[] => {
    if (!inherenteList || inherenteList.length === 0) return []
  
    return inherenteList
      .filter(item => typeof item.probability_id === 'number' && typeof item.impact_id === 'number')
      .map((item, index) => {
        const prob = Math.max(0, Math.min(4, item.probability_id - 1))
        const imp = Math.max(0, Math.min(4, item.impact_id - 1))
        const riskValue = getRiskValue(prob, imp)
  
        return {
          probability: prob,
          impact: imp,
          description: item.description || `Riesgo ${index + 1}`,
          value: riskValue
        }
      })
  }, [inherenteList])
  
  const transformedResidualRisks = useMemo((): TransformedRisk[] => {
    if (!residualList || residualList.length === 0) return []
  
    return residualList
      .filter(item => typeof item.n_probability === 'number' && typeof item.n_impact === 'number')
      .map((item, index) => {
        const probr = Math.max(0, Math.min(4, item.n_probability - 1))
        const impr = Math.max(0, Math.min(4, item.n_impact - 1))
        const riskValue = getRiskValue(probr, impr)
  
        return {
          probability: probr,
          impact: impr,
          description: `Riesgo Residual ${index + 1}`, // o podrías usar `Evento ${item.eventlog_id}`
          value: riskValue
        }
      })
  }, [residualList])
// Lista dinámica de riesgos inherentes
const dynamicInherentRisksList = useMemo(() => {
  console.log("Creando lista dinámica inherente con:", inherenteList)
  
  if (!inherenteList || inherenteList.length === 0) {
    console.log("No hay datos inherentes para la lista dinámica")
    return []
  }
  
  return inherenteList.map((item, index) => {
    const probOriginal = item.probability_id
    const impOriginal = item.impact_id
    
    // Validar que los valores sean números válidos
    if (isNaN(probOriginal) || isNaN(impOriginal)) {
      console.warn(`Valores inválidos en riesgo inherente ${index + 1}:`, item)
      return {
        id: `RI-${String(index + 1).padStart(3, '0')}`,
        nombre: item.description || `Riesgo Inherente ${index + 1}`,
        probabilidadInherente: 'N/A',
        impactoInherente: 'N/A',
        valorInherente: 0,
      }
    }
    
    const prob = Math.max(0, Math.min(4, probOriginal - 1))
    const imp = Math.max(0, Math.min(4, impOriginal - 1))
    const riskValue = getRiskValue(prob, imp)
    
    return {
      id: `RI-${String(index + 1).padStart(3, '0')}`,
      nombre: item.description || `Riesgo Inherente ${index + 1}`,
      probabilidadInherente: riskLevels[prob] || 'N/A',
      impactoInherente: impactLevels[imp] || 'N/A',
      valorInherente: riskValue,
    }
  })
}, [inherenteList])

  // Lista combinada de riesgos inherentes y residuales
  const combinedRisksList = useMemo(() => {
    console.log("Creando lista combinada con:", inherenteList, residualList)
    
    if (!inherenteList || inherenteList.length === 0) {
      console.log("No hay datos inherentes para la lista dinámica")
      return []
    }
    
    return inherenteList.map((item, index) => {
      // Procesar datos INHERENTES
      const probOriginalInh = item.probability_id
      const impOriginalInh = item.impact_id
      
      let probInh = 0, impInh = 0, riskValueInh = 0
      let probabilidadInherente = 'N/A', impactoInherente = 'N/A'
      
      if (!isNaN(probOriginalInh) && !isNaN(impOriginalInh)) {
        probInh = Math.max(0, Math.min(4, probOriginalInh - 1))
        impInh = Math.max(0, Math.min(4, impOriginalInh - 1))
        riskValueInh = getRiskValue(probInh, impInh)
        probabilidadInherente = riskLevels[probInh] || 'N/A'
        impactoInherente = impactLevels[impInh] || 'N/A'
      }
      
      // Procesar datos RESIDUALES (buscar correspondiente)
      // Puedes cambiar esta lógica según cómo quieras relacionar los datos
      const correspondingResidual = residualList[index] // Por índice
      // O si tienes alguna relación: residualList.find(r => r.eventlog_id === item.id_event)
      
      let probRes = 0, impRes = 0, riskValueRes = 0
      let probabilidadResidual = 'N/A', impactoResidual = 'N/A'
      
      if (correspondingResidual && 
          !isNaN(correspondingResidual.n_probability) && 
          !isNaN(correspondingResidual.n_impact)) {
        probRes = Math.max(0, Math.min(4, correspondingResidual.n_probability - 1))
        impRes = Math.max(0, Math.min(4, correspondingResidual.n_impact - 1))
        riskValueRes = getRiskValue(probRes, impRes)
        probabilidadResidual = riskLevels[probRes] || 'N/A'
        impactoResidual = impactLevels[impRes] || 'N/A'
      }
      
      return {
        id: `R-${String(index + 1).padStart(3, '0')}`,
        nombre: item.description || `Riesgo ${index + 1}`,
        // Datos inherentes
        probabilidadInherente,
        impactoInherente,
        valorInherente: riskValueInh,
        // Datos residuales
        probabilidadResidual,
        impactoResidual,
        valorResidual: riskValueRes,
      }
    })
  }, [inherenteList, residualList])

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (combinedRisksList.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay datos para exportar",
        description: "Primero debe cargar los datos de riesgos.",
      })
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(combinedRisksList)
    const columnWidths = [
      { wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, 
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
    ]
    worksheet["!cols"] = columnWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Matriz de Riesgos")
    XLSX.writeFile(workbook, "matriz-de-riesgos.xlsx")
  }

  // Debug: mostrar datos transformados
  console.log("Transformed risks:", transformedRisks)
  console.log("Dynamic risks list:", combinedRisksList)

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
            <HeatMapRisk 
              title="Probabilidad vs Impacto (Inherente)"
              risks={transformedRisks}
            />
          </CardContent>
        </Card>

        <Card className="border-t-4 border-violet-500 shadow-lg">
          <CardHeader>
            <CardTitle>Riesgo Residual</CardTitle>
          </CardHeader>
          <CardContent className="pl-24">
            <HeatMapRisk 
              title="Probabilidad vs Impacto (Residual)"
              risks={transformedResidualRisks.map(risk => ({
                ...risk,
                probability: Math.max(0, risk.probability - 1),
                impact: Math.max(0, risk.impact - 1)
              }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Leyenda */}
      <Card className="mt-6 border-t-4 border-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle>Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Riesgo Bajo (1-5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Riesgo Medio (6-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Riesgo Alto (11-15)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Riesgo Crítico (16+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
              <span className="text-sm">Número indica cantidad de riesgos en esa celda</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-t-4 border-green-500 shadow-lg">
        <CardHeader>
          <CardTitle>Listado de Riesgos Identificados ({inherenteList.length} riesgos)</CardTitle>
        </CardHeader>
        <CardContent>
          {combinedRisksList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay riesgos cargados desde el backend</p>
              <p className="text-sm mt-2">inherenteList: {JSON.stringify(inherenteList)}</p>
            </div>
          ) : (
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
                  {combinedRisksList.map((risk) => (
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
                            risk.valorInherente > 15
                              ? "bg-red-100 text-red-800"
                              : risk.valorInherente > 10
                                ? "bg-orange-100 text-orange-800"
                                : risk.valorInherente > 5
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
                            risk.valorResidual > 15
                              ? "bg-red-100 text-red-800"
                              : risk.valorResidual > 10
                                ? "bg-orange-100 text-orange-800"
                                : risk.valorResidual > 5
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}