"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts"; // ✅ importar el tipo correcto

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartProps {
  labels: string[];
  data: number[];
}

export default function PieChart({ labels, data }: PieChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const series = data;

  const options: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
    },
    colors: ["#06B6D4", "#9333EA", "#EF4444", "#3B82F6", "#F97316"],
    labels: labels,
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
  };

  if (!mounted) return <div className="h-full flex items-center justify-center">Loading chart...</div>;

  console.log("📊 PieChart - Labels:", labels);
  console.log("📊 PieChart - Data:", data);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <ReactApexChart options={options} series={series} type="pie" height="100%" />
    </div>
  );
}