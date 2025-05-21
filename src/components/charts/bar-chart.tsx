"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface BarChartProps {
  series: {
    name: string
    data: number[]
  }[]
  categories: string[]
}

export default function BarChart({ series, categories }: BarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    colors: ["#06B6D4", "#9333EA", "#EF4444"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      position: "top",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ["#9333EA", "#EF4444"],
        opacityFrom: 0.9,
        opacityTo: 0.3,
        stops: [0, 50, 100],
      },
    },
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  )
}
