"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface AreaChartProps {
  series: {
    name: string
    data: number[]
  }[]
  categories: string[]
}

export default function AreaChart({ series, categories }: AreaChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    colors: ["#40E0D0", "#8A2BE2", "#FF453A"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        gradientToColors: ["#8A2BE2", "#FF453A"],
        opacityFrom: 0.8,
        opacityTo: 0.4,
        stops: [0, 50, 100],
      },
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      position: "top",
    },
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="area" height="100%" />
    </div>
  )
}