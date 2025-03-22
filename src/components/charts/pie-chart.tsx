"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function PieChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const series = [44, 55, 13, 43, 22]

  const options = {
    chart: {
      type: "pie",
      background: "transparent",
    },
    colors: ["#06B6D4", "#9333EA", "#EF4444", "#3B82F6", "#F97316"],
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full flex items-center justify-center">
      <ReactApexChart options={options as any} series={series} type="pie" height="100%" />
    </div>
  )
}

