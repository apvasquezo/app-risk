"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, Shield, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br ">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Sistema de Gestión de Riesgos Operativos
          </h1>
          <p className="text-orange-400 text-xl">
            Monitoreo y control integral de riesgos empresariales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-purple-800 backdrop-blur-lg border-purple-300/20">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Identificación de Riesgos
              </h3>
              <p className="text-purple-200">
                Detección temprana de amenazas operativas
              </p>
            </div>
          </Card>

          <Card className="p-6  bg-purple-800 backdrop-blur-lg border-purple-300/20">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Control y Mitigación
              </h3>
              <p className="text-purple-200">
                Estrategias efectivas de control de riesgos
              </p>
            </div>
          </Card>

          <Card className="p-6  bg-purple-800 backdrop-blur-lg border-purple-300/20">
            <div className="flex flex-col items-center text-center">
              <BarChart3 className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Análisis Avanzado
              </h3>
              <p className="text-purple-200">
                Métricas y reportes detallados
              </p>
            </div>
          </Card>

          <Card className="p-6  bg-purple-800 backdrop-blur-lg border-purple-300/20">
            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Gestión Colaborativa
              </h3>
              <p className="text-purple-200">
                Trabajo en equipo y seguimiento
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => router.push("/login")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </main>
  );
}
