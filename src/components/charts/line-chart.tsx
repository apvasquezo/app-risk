"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

// Importar dinámicamente para evitar errores SSR
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

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    colors: ["#06B6D4", "#9333EA", "#EF4444"],
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
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="line" height="100%" />
    </div>
  )
}
