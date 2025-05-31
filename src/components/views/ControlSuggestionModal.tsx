"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  loading: boolean
}

export default function ControlSuggestionModal({ open, onClose, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] border-t-4 border-violet-500 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-violet-900">
            Sugerencia de Controles
          </DialogTitle>
          <DialogDescription>
            Controles recomendados basados en la descripción del evento y el factor de riesgo.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
              <p className="mt-4 text-violet-700">Generando sugerencias...</p>
            </div>
          ) : (
            <Tabs defaultValue="preventivos" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="preventivos">Preventivos</TabsTrigger>
                <TabsTrigger value="detectivos">Detectivos</TabsTrigger>
                <TabsTrigger value="correctivos">Correctivos</TabsTrigger>
              </TabsList>
              <TabsContent value="preventivos" className="border border-violet-800 p-4 rounded-md bg-fuchsia-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-violet-900" />
                  Controles Preventivos
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Autenticación de doble factor</li>
                  <li>Verificación biométrica</li>
                  <li>Capacitación al personal</li>
                </ul>
              </TabsContent>
              <TabsContent value="detectivos" className="border border-violet-800 p-4 rounded-md bg-fuchsia-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-violet-900" />
                  Controles Detectivos
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sistema de alertas</li>
                  <li>Monitoreo en tiempo real</li>
                </ul>
              </TabsContent>
              <TabsContent value="correctivos" className="border border-violet-800 p-4 rounded-md bg-fuchsia-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-violet-900" />
                  Controles Correctivos
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Bloqueo de cuentas</li>
                  <li>Notificación a clientes</li>
                </ul>
              </TabsContent>
            </Tabs>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-orange-500 hover:bg-violet-900 text-white">
            Guardar Control Sugerido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}