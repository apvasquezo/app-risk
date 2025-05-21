"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface HeatmapChartProps {
  series: {
    name: string
    data: { x: string; y: number }[]
  }[]
  xCategories: string[]
}

export default function HeatmapChart({ series, xCategories }: HeatmapChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#06B6D4"],
    xaxis: {
      categories: xCategories,
    },
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 20,
              color: "#4CAF50", // Verde - Bajo
              name: "Bajo",
            },
            {
              from: 21,
              to: 50,
              color: "#FFEE58", // Amarillo - Medio
              name: "Medio",
            },
            {
              from: 51,
              to: 90,
              color: "#FF0000", // Rojo - Alto
              name: "Alto",
            },
          ],
        },
      },
    },
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="heatmap" height="100%" />
    </div>
  )
}
