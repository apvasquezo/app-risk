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
        const responseH = await api.get("/dashboard/risk-heatmap");
        const dataH = responseH.data;
        const categorias = Array.from(
          new Set(dataH.flatMap((serie: any) => serie.data.map((d: any) => d.x as string)))
        ) as string[];
        setHeatmapCategories(categorias);
        setHeatmapData(dataH)
        //datos para la grafica de barras Frecuencia de incidente de riesgos
        
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
          <CardHeader><CardTitle>Distribución de Riesgos por Tipo</CardTitle></CardHeader>
          <CardContent className="h-80">
            <LineChart
              categories={["Ene", "Feb", "Mar", "Abr", "May"]}
              series={[
                { name: "Riesgo Inherente", data: [20, 18, 17, 15, 14] },
                { name: "Riesgo Residual", data: [12, 10, 9, 7, 6] },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Evaluaciones por Nivel de Impacto</CardTitle></CardHeader>
          <CardContent className="h-80">
            <BarChart
              categories={["Insignificante", "Menor", "Moderado", "Mayor", "Catastrófico"]}
              series={[{ name: "Impactos", data: [2, 5, 7, 4, 3] }]}
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
          <CardHeader><CardTitle>Frecuencia de Evaluaciones de Control</CardTitle></CardHeader>
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
