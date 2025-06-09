"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChart from "@/components/charts/pie-chart";
import BarChart from "@/components/charts/bar-chart";
import LineChart from "@/components/charts/line-chart";
import AreaChart from "@/components/charts/area-chart";
import RadarChart from "@/components/charts/radar-chart";
import RiskScatterChart from "../charts/scatter-chart";
import api from "@/lib/axios";

export default function Dashboard() {
  const [planStatusLabels, setPlanStatusLabels] = useState<string[]>([]);
  const [planStatusData, setPlanStatusData] = useState<number[]>([]);
  const [complianceData, setComplianceData] = useState<number[]>([]);
  const [complianceLabel, setComplianceLabel] = useState<string[]>([]);
  const [efficiencyLabel, setEfficiencyLabel] = useState<string[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<number[]>([]);
  const [frecuencyLabels, setFrecuencyLabels] = useState<string[]>([])
  const [frecuencyData, setFrecuencyData] = useState<number[]>([])

  // Obtener datos de estado de planes
  useEffect(() => {
    async function fetchPlanStatus() {
      try {
        const responseT = await api.get("/dashboard/plan");
        const labels = (responseT.data).map((p: { state: string }) => p.state);
        const dataT = (responseT.data).map((p: { amount: number }) => p.amount);
        setPlanStatusLabels(labels);
        setPlanStatusData(dataT);

        //datos para la grafica de barras KRI eficiencia del control
        const responseEfficiency = await api.get("/dashboard/efficiency");
        const labelE = (responseEfficiency.data).map((e: { state: string }) => e.state);
        const dataE = (responseEfficiency.data).map((e: { amount: number }) => e.amount);
        setEfficiencyLabel(labelE);
        setEfficiencyData(dataE);

        //datos para la grafica radar cumplimiento por responsable
        const responseCompliance = await api.get("/dashboard/compliance");
        const labelCmpliance = (responseCompliance.data).map((p: { responsible: string }) => p.responsible);
        const dataCompliance = (responseCompliance.data).map((p: { cumplimiento: number }) => p.cumplimiento);
        setComplianceLabel(labelCmpliance);
        setComplianceData(dataCompliance);
        // datos para la grafica de lineas KRI frecuencia de evaluacion de controles
        const responseFrecuency = await api.get("/dashboard/frequency");
        console.log("que llega de frecuency ", responseFrecuency)        
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
          <CardHeader><CardTitle>Cumplimiento por Responsable</CardTitle></CardHeader>
          <CardContent className="h-80">
            <RadarChart
              categories={complianceLabel}
              series={[{ name: "Cumplimiento", data: complianceData }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Riesgos por Proceso</CardTitle></CardHeader>
          <CardContent className="h-80">
            <RiskScatterChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
