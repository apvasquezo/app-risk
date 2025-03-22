
"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function AreaChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const series = [
    {
      name: "New Users",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Returning Users",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ]

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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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

