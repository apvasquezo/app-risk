"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function HeatmapChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function generateData(count: number, yrange: { min: number; max: number }) {
    let i = 0
    const series = []
    while (i < count) {
      const x = (i + 1).toString()
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
      series.push({ x, y })
      i++
    }
    return series
  }

  const series = [
    {
      name: "Mon",
      data: generateData(7, { min: 0, max: 90 }),
    },
    {
      name: "Tue",
      data: generateData(7, { min: 0, max: 90 }),
    },
    {
      name: "Wed",
      data: generateData(7, { min: 0, max: 90 }),
    },
    {
      name: "Thu",
      data: generateData(7, { min: 0, max: 90 }),
    },
    {
      name: "Fri",
      data: generateData(7, { min: 0, max: 90 }),
    },
  ]

  const options = {
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
      categories: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm"],
    },
    title: {
      text: "Weekly Activity",
      align: "left",
      style: {
        fontSize: "14px",
      },
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 20,
              color: "#4CAF50", 
              name: "Low",
            },
            {
              from: 21,
              to: 50,
              color: "#FFEE58", 
              name: "Medium",
            },
            {
              from: 51,
              to: 90,
              color: "#ff0000", 
              name: "High",
            },
          ],
        },
      },
    },
  }

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>

  return (
    <div className="h-full w-full">
      <ReactApexChart options={options as any} series={series} type="heatmap" height="100%" />
    </div>
  )
}

