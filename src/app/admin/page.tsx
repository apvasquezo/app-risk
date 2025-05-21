"use client";

import AuthMiddleware from "@/hooks/authMiddleware"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "@/components/charts/line-chart";
import BarChart from "@/components/charts/bar-chart";
import AreaChart from "@/components/charts/area-chart";
import PieChart from "@/components/charts/pie-chart";
import RadarChart from "@/components/charts/radar-chart";
import HeatmapChart from "@/components/charts/heatmap-chart";

export default function Dashboard() {
  return (
    <AuthMiddleware rolesAllowed={["admin"]}> {/* Protege la ruta para usuarios con rol "admin" */}
      <div className="container mx-8 py-3">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <LineChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Segments</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <PieChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <RadarChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <HeatmapChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthMiddleware>
  );
}