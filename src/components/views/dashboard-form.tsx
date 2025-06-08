"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChart from "@/components/charts/pie-chart";
import BarChart from "@/components/charts/bar-chart";
import LineChart from "@/components/charts/line-chart";
import AreaChart from "@/components/charts/area-chart";
import RadarChart from "@/components/charts/radar-chart";
import HeatmapChart from "@/components/charts/heatmap-chart";
import api from "@/lib/axios";

export default function Dashboard() {
  const [planStatusLabels, setPlanStatusLabels] = useState<string[]>([]);
  const [planStatusData, setPlanStatusData] = useState<number[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [heatmapCategories, setHeatmapCategories] = useState<string[]>([]);
  const [efficiencyLabel, setEfficiencyLabel] = useState<string[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<number[]>([]);
  const [frecuencyLabels, setFrecuencyLabels] = useState<string[]>([])
  const [frecuencyData, setFrecuencyData] = useState<number[]>([])

  // Obtener datos de estado de planes
  useEffect(() => {
    async function fetchPlanStatus() {
      try {
        const responseT = await api.get("/dashboard");
        const plans = responseT.data;

        const labels = plans.map((p: { state: string }) => p.state);
        const dataT = plans.map((p: { cantidad: number }) => p.cantidad);
        setPlanStatusLabels(labels);
        setPlanStatusData(dataT);
        //datos para la grafica heatmap
        //const responseH = await api.get("/dashboard/risk-heatmap");
        //const dataH = responseH.data;
        //const categorias = Array.from(
          //new Set(dataH.flatMap((serie: any) => serie.data.map((d: any) => d.x as string)))
        //) as string[];
        //setHeatmapCategories(categorias);
        //setHeatmapData(dataH)
        //datos para la grafica de barras KRI eficiencia del control
        const responseEfficiency = await api.get("/dashboard/efficiency");
        const labelE = (responseEfficiency.data).map((e: { state: string }) => e.state);
        const dataE = (responseEfficiency.data).map((e: { amount: number }) => e.amount);
        setEfficiencyLabel(labelE);
        setEfficiencyData(dataE);
        // datos para la grafica de lineas KRI frecuencia de evaluacion de controles
        const responseFrecuency = await api.get("/dashboard/frequency");
        const labelF = responseFrecuency.data.map((e: { periodo: string }) => e.periodo)
        const dataF = responseFrecuency.data.map((e: { cantidad: any }) => Number(e.cantidad))    
        setFrecuencyLabels(labelF)
        setFrecuencyData(dataF)
        
      } catch (error) {
        console.error("Error al obtener los estados de planes:", error);
      }
    }

    fetchPlanStatus();
  }, []);

  return (
    <div className="container mx-8 py-3">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Dashboard de Riesgos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Frecuencia Evaluación de Controles</CardTitle></CardHeader>
          <CardContent className="h-80">
            <LineChart
              categories={frecuencyLabels}
              series={[
                { name: "evaluaciones", data: frecuencyData },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Eficiencia de los Controles</CardTitle></CardHeader>
          <CardContent className="h-80">
          <BarChart
            categories={efficiencyLabel}
            series={[{ name: "Cantidad", data: efficiencyData }]}
          />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tendencia de Riesgos Residuales</CardTitle></CardHeader>
          <CardContent className="h-80">
            <AreaChart
              categories={["Sin controlar", "En progreso", "Controlado"]}
              series={[{ name: "Cantidad", data: [3, 6, 5] }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Estado de Planes de Acción</CardTitle></CardHeader>
          <CardContent className="h-80">
            <PieChart
              labels={planStatusLabels}
              data={planStatusData}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Frecuencia Aplicacion de Controles</CardTitle></CardHeader>
          <CardContent className="h-80">
            <RadarChart
              categories={["Semanal", "Mensual", "Trimestral", "Anual"]}
              series={[{ name: "Evaluaciones", data: [2, 7, 4, 1] }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mapa de Calor de Riesgos por Proceso</CardTitle></CardHeader>
          <CardContent className="h-80">
            <HeatmapChart
              xCategories={heatmapCategories}
              series={heatmapData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
