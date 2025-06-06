"use client"
import { useEffect, useState } from "react"
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
  field1: string  // Tipo de Riesgo
  field2: string  // Factor de Riesgo
  field3: string  // Proceso
  field4: string  // Canal
  field5: string  // Evento de Riesgo
}

interface ControlSuggestions {
  preventivo: string
  detectivo: string
  correctivo: string
}

export default function ControlSuggestionModal({
  open,
  onClose,
  loading,
  field1,
  field2,
  field3,
  field4,
  field5
}: Props) {
  const [suggestions, setSuggestions] = useState<ControlSuggestions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAISuggestions = async () => {
    if (!field1 || !field2 || !field3 || !field4 || !field5) {
      setError("Faltan datos del riesgo para generar sugerencias")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Llamada a tu API route de Next.js en lugar de directamente a OpenAI
      const response = await fetch('app/api/suggestion/route.ts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field1,
          field2,
          field3,
          field4,
          field5
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No se recibió respuesta de la API')
      }

      // Intentar parsear la respuesta JSON
      try {
        const parsedSuggestions = JSON.parse(content.trim())
        setSuggestions(parsedSuggestions)
      } catch (parseError) {
        // Si no es JSON válido, crear estructura manual
        console.warn('Respuesta no es JSON válido, procesando manualmente:', content)
        
        // Procesamiento básico si la respuesta no es JSON
        const lines = content.split('\n').filter((line: string) => line.trim())
        const fallbackSuggestions = {
          preventivo: lines.find((line: string) => line.toLowerCase().includes('preventivo'))?.replace(/^\d+\.?\s*\*?\*?.*?:?\*?\*?\s*/i, '') || 'Implementar medidas preventivas',
          detectivo: lines.find((line: string) => line.toLowerCase().includes('detectivo'))?.replace(/^\d+\.?\s*\*?\*?.*?:?\*?\*?\s*/i, '') || 'Establecer sistemas de detección',
          correctivo: lines.find((line: string) => line.toLowerCase().includes('correctivo'))?.replace(/^\d+\.?\s*\*?\*?.*?:?\*?\*?\s*/i, '') || 'Definir acciones correctivas'
        }
        setSuggestions(fallbackSuggestions)
      }
    } catch (error) {
      console.error('Error al obtener sugerencias:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido al generar sugerencias')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && field1 && field2 && field3 && field4 && field5) {
      fetchAISuggestions()
    }
  }, [open, field1, field2, field3, field4, field5])

  const handleClose = () => {
    setSuggestions(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] border-t-4 border-violet-500 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-violet-900">
            Sugerencia de Controles
          </DialogTitle>
          <DialogDescription>
            Controles recomendados basados en la información proporcionada.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
              <p className="mt-4 text-violet-700">Generando sugerencias...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={fetchAISuggestions} 
                variant="outline"
                className="text-violet-600 border-violet-600"
              >
                Reintentar
              </Button>
            </div>
          ) : suggestions ? (
            <Tabs defaultValue="preventivos" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="preventivos">Preventivos</TabsTrigger>
                <TabsTrigger value="detectivos">Detectivos</TabsTrigger>
                <TabsTrigger value="correctivos">Correctivos</TabsTrigger>
              </TabsList>

              <TabsContent value="preventivos" className="border border-violet-800 p-4 rounded-md bg-fuchsia-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-violet-900" />
                  Control Preventivo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {suggestions.preventivo}
                </p>
              </TabsContent>

              <TabsContent value="detectivos" className="border border-violet-800 p-4 rounded-md bg-fuchsia-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-violet-900" />
                  Control Detectivo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {suggestions.detectivo}
                </p>
              </TabsContent>

              <TabsContent value="correctivos" className="border border-violet-800 p-4 rounded-md bg-fuchsia-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-violet-900" />
                  Control Correctivo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {suggestions.correctivo}
                </p>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No hay sugerencias disponibles</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            onClick={handleClose} 
            className="bg-orange-500 hover:bg-violet-900 text-white"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}