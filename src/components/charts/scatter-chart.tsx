"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando gráfica...</span>
    </div>
  ),
})

interface RiskData {
  level: string
  count: number
}

interface RiskScatterChartProps {
  data?: RiskData[]
}

export default function RiskScatterChart({ data }: RiskScatterChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const defaultData: RiskData[] = [
    { level: "Bajo", count: 3 },
    { level: "Medio", count: 5 },
    { level: "Alto", count: 4 },
    { level: "Crítico", count: 2 },
  ]

  const chartData = data || defaultData

  const levelColors: Record<string, string> = {
    Bajo: "#10B981",
    Medio: "#F59E0B",
    Alto: "#EF4444",
    Crítico: "#7C2D12",
  }

  // Mapear niveles a números para el eje X
  const levelToNumber: Record<string, number> = {
    Bajo: 1,
    Medio: 2,
    Alto: 3,
    Crítico: 4,
  }

  // Crear series separadas para cada nivel de riesgo
  const createSeries = () => {
    return chartData.map((item) => {
      const points = []
      const baseX = levelToNumber[item.level]

      // Crear múltiples puntos para cada proceso en este nivel
      for (let i = 0; i < item.count; i++) {
        // Distribuir horizontalmente los puntos si hay múltiples
        const xOffset = item.count > 1 ? (i - (item.count - 1) / 2) * 0.12 : 0

        points.push({
          x: baseX + xOffset,
          y: Math.random() * 1.5 + 1.5, // Posición Y más centrada
        })
      }

      return {
        name: item.level,
        data: points,
        color: levelColors[item.level],
      }
    })
  }

  const series = createSeries()

  const options: ApexOptions = {
    chart: {
      type: "scatter",
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      offsetX: 0,
      offsetY: 0,
      parentHeightOffset: 0,
    },
    markers: {
      size: 16,
      strokeWidth: 2,
      strokeColors: "#fff",
      hover: {
        size: 20,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "numeric",
      min: 0.3,
      max: 4.7,
      tickAmount: 4,
      labels: {
        formatter: (val: string | number) => {
          const num = Math.round(Number(val))
          const levels = ["", "Bajo", "Medio", "Alto", "Crítico"]
          return levels[num] || ""
        },
        style: {
          fontSize: "11px",
          colors: ["#6B7280"],
        },
        offsetY: 5,
      },
      title: {
        text: "Nivel de Riesgo",
        style: {
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        },
        offsetY: 10,
      },
      axisBorder: {
        show: true,
        color: "#E5E7EB",
      },
      axisTicks: {
        show: true,
        color: "#E5E7EB",
      },
    },
    yaxis: {
      title: {
        text: "Distribución de Procesos",
        style: {
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        },
      },
      min: 0.5,
      max: 3.5,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
        fontSize: "12px",
        markers: {
          size: 10, // tamaño del círculo del marcador
          shape: "circle",
        },
        itemMargin: {
          horizontal: 12,
          vertical: 5,
        },
        offsetY: 10,
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number }) => {
        const seriesName = series[seriesIndex]?.name || ""
        const count = chartData.find((d) => d.level === seriesName)?.count || 0
        const color = levelColors[seriesName] || "#000"

        return `
          <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
              <span class="font-medium">${seriesName}</span>
            </div>
            <div class="text-sm text-gray-600 mt-1">
              Proceso ${dataPointIndex + 1} de ${count}
            </div>
          </div>
        `
      },
    },
    stroke: {
      width: 0,
    },
  }

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando gráfica...</span>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-4">
      <div className="w-full h-full">
        <Chart options={options} series={series} type="scatter" height="100%" />
      </div>
    </div>
  )
}
