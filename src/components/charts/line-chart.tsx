"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface LineChartProps {
  series: {
    name: string
    data: number[]
  }[]
  categories: string[]
}

export default function LineChart({ series, categories }: LineChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Semáforo de colores por valor
  const getColor = (value: number): string => {
    if (value <= 2) return "#EF4444" // rojo - Crítico
    if (value <= 5) return "#FACC15" // amarillo - Aceptable
    return "#22C55E" // verde - Excelente
  }

  // Asignar colores a los puntos de la serie
  const pointColors = series[0].data.map(getColor)

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      position: "top",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    markers: {
      size: 6,
      colors: pointColors,
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          if (val <= 2) return `${val} (Crítico)`
          if (val <= 5) return `${val} (Aceptable)`
          return `${val} (Excelente)`
        },
      },
    },
  }

  if (!mounted) {
    return <div className="h-full flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="line" height="100%" />
    </div>
  )
}
