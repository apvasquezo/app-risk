"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function BarChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const series = [
    {
      name: "Product A",
      data: [44, 55, 57, 56, 61, 58],
    },
    {
      name: "Product B",
      data: [76, 85, 101, 98, 87, 105],
    },
  ]

  const options = {
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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
      <ReactApexChart options={options as any} series={series} type="bar" height="100%" />
    </div>
  )
}

