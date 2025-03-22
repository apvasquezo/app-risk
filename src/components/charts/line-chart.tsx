"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function LineChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const series = [
    {
      name: "Revenue",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 160, 180],
    },
    {
      name: "Profit",
      data: [15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90],
    },
  ]

  const options = {
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
      <ReactApexChart options={options as any} series={series} type="line" height="100%" />
    </div>
  )
}
