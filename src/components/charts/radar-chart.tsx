"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface RadarChartProps {
  series: {
    name: string
    data: number[]
  }[]
  categories: string[]
}

export default function RadarChart({ series, categories }: RadarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    colors: ["#06B6D4", "#9333EA", "#EF4444"],
    xaxis: {
      categories: categories,
    },
    yaxis: {
      show: false,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    fill: {
      opacity: 0.4,
    },
    stroke: {
      width: 2,
    },
    legend: {
      position: "bottom",
    },
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="radar" height="100%" />
    </div>
  )
}
