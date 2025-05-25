"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PieChart from "@/components/charts/pie-chart"
import BarChart from "@/components/charts/bar-chart"
import LineChart from "@/components/charts/line-chart"
import AreaChart from "@/components/charts/area-chart"
import RadarChart from "@/components/charts/radar-chart"
import HeatmapChart from "@/components/charts/heatmap-chart"

export default function Dashboard() {
  return (
    <div className="container mx-8 py-3">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Dashboard de Riesgos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Distribución de Riesgos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Riesgos por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
             <LineChart
              categories={["Ene", "Feb", "Mar", "Abr", "May"]}
              series={[
                {
                  name: "Riesgo Inherente",
                  data: [20, 18, 17, 15, 14],
                },
                {
                  name: "Riesgo Residual",
                  data: [12, 10, 9, 7, 6],
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* Evaluaciones por Nivel de Impacto */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones por Nivel de Impacto</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              categories={["Insignificante", "Menor", "Moderado", "Mayor", "Catastrófico"]}
              series={[
                {
                  name: "Impactos",
                  data: [2, 5, 7, 4, 3],
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* Tendencia de Riesgos Residuales */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Riesgos Residuales</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
         <AreaChart
              categories={["Pendiente", "En progreso", "Finalizado"]}
              series={[
                { name: "Cantidad", data: [3, 6, 5] },
              ]}
            />
          </CardContent>
        </Card>

        {/* Estado de Planes de Acción */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Planes de Acción</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
              <PieChart
              labels={["Operacional", "Legal", "Financiero", "Tecnológico"]}
              data={[10, 4, 6, 8]}
            />
          </CardContent>
        </Card>

        {/* Frecuencia de Evaluaciones de Control */}
        <Card>
          <CardHeader>
            <CardTitle>Frecuencia de Evaluaciones de Control</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <RadarChart
              categories={["Semanal", "Mensual", "Trimestral", "Anual"]}
              series={[
                {
                  name: "Evaluaciones",
                  data: [2, 7, 4, 1],
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* Mapa de Calor de Riesgos por Proceso */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Calor de Riesgos por Proceso</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <HeatmapChart
              xCategories={["Proceso A", "Proceso B", "Proceso C", "Proceso D"]}
              series={[
                {
                  name: "Muy Bajo",
                  data: [
                    { x: "Proceso A", y: 5 },
                    { x: "Proceso B", y: 10 },
                    { x: "Proceso C", y: 15 },
                    { x: "Proceso D", y: 8 },
                  ],
                },
                {
                  name: "Bajo",
                  data: [
                    { x: "Proceso A", y: 20 },
                    { x: "Proceso B", y: 25 },
                    { x: "Proceso C", y: 22 },
                    { x: "Proceso D", y: 18 },
                  ],
                },
                {
                  name: "Medio",
                  data: [
                    { x: "Proceso A", y: 35 },
                    { x: "Proceso B", y: 40 },
                    { x: "Proceso C", y: 38 },
                    { x: "Proceso D", y: 32 },
                  ],
                },
                {
                  name: "Alto",
                  data: [
                    { x: "Proceso A", y: 60 },
                    { x: "Proceso B", y: 55 },
                    { x: "Proceso C", y: 70 },
                    { x: "Proceso D", y: 65 },
                  ],
                },
                {
                  name: "Muy Alto",
                  data: [
                    { x: "Proceso A", y: 80 },
                    { x: "Proceso B", y: 85 },
                    { x: "Proceso C", y: 78 },
                    { x: "Proceso D", y: 82 },
                  ],
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}