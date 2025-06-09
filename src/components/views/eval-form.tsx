"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { ExportButtons } from "@/components/ui/export-buttons"
import {
  transformProbability,
  transformEvaluation,
  transformImpact,
  transformControls,
  transformRisk,
} from "@/lib/transformers"
import api from "@/lib/axios"

interface ControlEvaluation {
  [key: string]: unknown
  id: string
  idControl: string
  idEvento: string
  fechaEvaluacion: string
  nivelProbabilidad: string
  nivelImpacto: string
  fechaProximaEvaluacion: string
  descripcion: string
  observacion: string
  efectividadControl: string
  estadoControl: string
  estadoEvaluacion: string
  usuario: string
}

interface Prob {
  level: number
  description: string
  definition: string
  criteria_por: number
}

interface Impact {
  level: number
  description: string
  definition: string
  criteria_smlv: number
}

interface EventLog {
  id: string
  name: string
}

interface Control {
  id: string
  tipoControl: string
  descripcion: string
  frecuencia: string
  responsable: string
}

const efectyControl = ["Critica 0% - 20%", "Baja 21% - 50%", "Media 51% - 80%", "Alta 81% - 100%"]
const stateControl = ["Propuesto", "Aprobado", "En Implementación", "Activo", "En Revisión", "Eliminado"]
const stateEvaluation = [
  "Pendiente de Evaluación",
  "En Evaluación",
  "Efectivo",
  "Inefectivo",
  "Con Observaciones",
  "Finalizado",
]
const observacionOptions = [
  "Asignación del Control",
  "Primera evaluacion",
  "Seguimiento al Control",
  "Sin Evaluaciones",
]

export default function ControlEvaluationForm() {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    idControl: "",
    idEvento: "",
    fechaEvaluacion: "",
    nivelProbabilidad: "",
    nivelImpacto: "",
    fechaProximaEvaluacion: "",
    descripcion: "",
    observacion: "",
    efectividadControl: "",
    estadoControl: "",
    estadoEvaluacion: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [probList, setProbList] = useState<Prob[]>([])
  const [impactList, setImpactList] = useState<Impact[]>([])
  const [eventLogList, setEventLogList] = useState<EventLog[]>([])
  const [controlList, setControlList] = useState<Control[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    idControl: false,
    idEvento: false,
    fechaEvaluacion: false,
    nivelProbabilidad: false,
    nivelImpacto: false,
    fechaProximaEvaluacion: false,
    descripcion: false,
    observacion: false,
    efectividadControl: false,
    estadoControl: false,
    estadoEvaluacion: false,
  })

  const [evaluations, setEvaluations] = useState<ControlEvaluation[]>([])

  const getControlDescription = useCallback(
    (id_control: string) => {
      const control = controlList.find((type) => type.id === id_control.toString())
      return control ? control.descripcion : id_control
    },
    [controlList],
  )

  const getRiskDescription = useCallback(
    (id_eventlog: string) => {
      const risk = eventLogList.find((type) => type.id === id_eventlog.toString())
      return risk ? risk.name : id_eventlog
    },
    [eventLogList],
  )

  const getProbabilityDescription = useCallback(
    (level: string) => {
      const prob = probList.find((p) => p.level.toString() === level)
      return prob ? prob.description : level
    },
    [probList],
  )

  const getImpactDescription = useCallback(
    (level: string) => {
      const impact = impactList.find((i) => i.level.toString() === level)
      return impact ? impact.description : level
    },
    [impactList],
  )

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setIsLoading(true)

        const responseProb = await api.get("/probabilities")
        setProbList(transformProbability(responseProb.data))

        const responseImp = await api.get("/impacts")
        setImpactList(transformImpact(responseImp.data))

        const responseControls = await api.get("/controls")
        setControlList(transformControls(responseControls.data))

        const responseEventLog = await api.get("/event_logs/name")
        setEventLogList(transformRisk(responseEventLog.data))

        const responseEval = await api.get("/evalcontrol")
        setEvaluations(transformEvaluation(responseEval.data))
        console.log("evaluacion ", responseEval.data)
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudo obtener los listados.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvaluation()
  }, [toast])

  const validateForm = useCallback(() => {
    const newErrors = {
      idControl: !formData.idControl.trim(),
      idEvento: !formData.idEvento.trim(),
      fechaEvaluacion: !formData.fechaEvaluacion.trim(),
      nivelProbabilidad: !formData.nivelProbabilidad.trim(),
      nivelImpacto: !formData.nivelImpacto.trim(),
      fechaProximaEvaluacion: !formData.fechaProximaEvaluacion.trim(),
      descripcion: !formData.descripcion.trim(),
      observacion: !formData.observacion.trim(),
      efectividadControl: !formData.efectividadControl.trim(),
      estadoControl: !formData.estadoControl.trim(),
      estadoEvaluacion: !formData.estadoEvaluacion.trim(),
    }
    // Validación fechas
    let fechasValidas = true
    if (formData.fechaEvaluacion && formData.fechaProximaEvaluacion) {
      if (new Date(formData.fechaProximaEvaluacion) < new Date(formData.fechaEvaluacion)) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "La fecha de próxima evaluación debe ser posterior a la fecha de evaluación.",
        })
        fechasValidas = false
      }
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error) && fechasValidas
  }, [formData, toast])

  const resetForm = useCallback(() => {
    setFormData({
      idControl: "",
      idEvento: "",
      fechaEvaluacion: "",
      nivelProbabilidad: "",
      nivelImpacto: "",
      fechaProximaEvaluacion: "",
      descripcion: "",
      observacion: "",
      efectividadControl: "",
      estadoControl: "",
      estadoEvaluacion: "",
    })
    setEditingId(null)
    setErrors({
      idControl: false,
      idEvento: false,
      fechaEvaluacion: false,
      nivelProbabilidad: false,
      nivelImpacto: false,
      fechaProximaEvaluacion: false,
      descripcion: false,
      observacion: false,
      efectividadControl: false,
      estadoControl: false,
      estadoEvaluacion: false,
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "Todos los campos son obligatorios.",
        })
        return
      }
      setIsLoading(true)
      try {
        const efectividadMap: Record<string, number> = {
          "Critica 0% - 20%": 0.2,
          "Baja 21% - 50%": 0.5,
          "Media 51% - 80%": 0.8,
          "Alta 81% - 100%": 1.0,
        }

        const eficiencia = efectividadMap[formData.efectividadControl]
        if (eficiencia === undefined) {
          toast({
            variant: "destructive",
            title: "Error de validación",
            description: "Seleccione una efectividad válida.",
          })
          return
        }
        const payload = {
          eventlog_id: Number.parseInt(formData.idEvento),
          control_id: Number.parseInt(formData.idControl),
          eval_date: formData.fechaEvaluacion,
          n_probability: formData.nivelProbabilidad,
          n_impact: formData.nivelImpacto,
          next_date: formData.fechaProximaEvaluacion,
          description: formData.descripcion,
          state_control: formData.estadoControl,
          state_evaluation: formData.estadoEvaluacion,
          control_efficiency: eficiencia,
          observation: formData.observacion,
          created_by: "admin",
        }
        if (editingId) {
          await api.put(`/evalcontrol/${editingId}`, payload)
          const responseEval = await api.get("/evalcontrol")
          setEvaluations(transformEvaluation(responseEval.data))
          toast({
            title: "Evaluación actualizada",
            description: "La evaluación ha sido actualizada exitosamente.",
          })
        } else {
          await api.post("/evalcontrol", payload)
          console.log("el payload ", payload)
          const responseEval = await api.get("/evalcontrol")
          setEvaluations(transformEvaluation(responseEval.data))
          toast({
            title: "Evaluación registrada",
            description: "La nueva evaluación ha sido registrada exitosamente.",
          })
        }
        resetForm()
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al procesar la solicitud.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [
      formData,
      editingId,
      evaluations,
      validateForm,
      resetForm,
      toast,
      getControlDescription,
      getProbabilityDescription,
      getImpactDescription,
    ],
  )

  const handleEdit = useCallback((evaluation: ControlEvaluation) => {
    console.log("Vamos a editar ", evaluation)

    // Asegurarse de que todos los valores sean strings
    setFormData({
      idControl: String(evaluation.idControl || ""),
      idEvento: String(evaluation.idEvento || ""),
      fechaEvaluacion: String(evaluation.fechaEvaluacion || ""),
      nivelProbabilidad: String(evaluation.nivelProbabilidad || ""),
      nivelImpacto: String(evaluation.nivelImpacto || ""),
      fechaProximaEvaluacion: String(evaluation.fechaProximaEvaluacion || ""),
      descripcion: String(evaluation.descripcion || ""),
      observacion: String(evaluation.observacion || ""),
      efectividadControl: String(evaluation.efectividadControl || ""),
      estadoControl: String(evaluation.estadoControl || ""),
      estadoEvaluacion: String(evaluation.estadoEvaluacion || ""),
    })

    setEditingId(evaluation.id)

    // Limpiar errores al cargar datos para edición
    setErrors({
      idControl: false,
      idEvento: false,
      fechaEvaluacion: false,
      nivelProbabilidad: false,
      nivelImpacto: false,
      fechaProximaEvaluacion: false,
      descripcion: false,
      observacion: false,
      efectividadControl: false,
      estadoControl: false,
      estadoEvaluacion: false,
    })

    // Forzar actualización después de un pequeño retraso para asegurar que los Select se actualicen
    setTimeout(() => {
      console.log("Estado del formulario después de editar:", formData)
    }, 100)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar esta evaluación?")
      if (!confirmDelete) return

      setIsLoading(true)
      try {
        await api.delete(`/evalcontrol/${id}`)

        setEvaluations(evaluations.filter((evaluation) => evaluation.id !== id))
        toast({
          title: "Evaluación eliminada",
          description: "La evaluación ha sido eliminada exitosamente.",
        })
        if (editingId === id) {
          resetForm()
        }
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al eliminar la evaluación.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [evaluations, editingId, resetForm, toast],
  )

  // Función para obtener el color de fondo según el nivel
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Bajo":
        return "bg-green-100 text-green-800"
      case "Medio":
        return "bg-blue-100 text-blue-800"
      case "Alto":
        return "bg-yellow-100 text-yellow-800"
      case "Muy Alto":
        return "bg-orange-100 text-orange-800"
      case "Crítico":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Añadir este useEffect después de las otras declaraciones de useEffect
  useEffect(() => {
    if (editingId) {
      console.log("Valores actuales del formulario:", formData)
    }
  }, [formData, editingId])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Evaluación de Controles</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Riesgo (aplicar control) <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.idEvento}
                  onValueChange={(value) => {
                    setFormData({ ...formData, idEvento: value })
                    setErrors({ ...errors, idEvento: false })
                  }}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.idEvento ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un riesgo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {eventLogList
                      .filter((evento) => evento && evento.id) // Filtrar elementos válidos
                      .map((evento, index) => (
                        <SelectItem
                          key={`evento-${evento.id || index}`}
                          value={evento.id}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {evento.name || "Sin nombre"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.idEvento && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Control (a aplicar o evaluar) <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.idControl}
                  onValueChange={(value) => {
                    setFormData({ ...formData, idControl: value })
                    setErrors({ ...errors, idControl: false })
                  }}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.idControl ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un control" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {controlList
                      .filter((control) => control && control.id) // Filtrar elementos válidos
                      .map((control, index) => (
                        <SelectItem
                          key={`control-${control.id || index}`}
                          value={control.id}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {control.descripcion || "Sin descripción"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.idControl && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha evaluación <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.fechaEvaluacion}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaEvaluacion: e.target.value })
                    setErrors({ ...errors, fechaEvaluacion: false })
                  }}
                  className={errors.fechaEvaluacion ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaEvaluacion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha próxima evaluación <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.fechaProximaEvaluacion}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaProximaEvaluacion: e.target.value })
                    setErrors({ ...errors, fechaProximaEvaluacion: false })
                  }}
                  className={errors.fechaProximaEvaluacion ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaProximaEvaluacion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Ingrese una descripción"
                  value={formData.descripcion}
                  onChange={(e) => {
                    setFormData({ ...formData, descripcion: e.target.value })
                    setErrors({ ...errors, descripcion: false })
                  }}
                  className={errors.descripcion ? "border-red-500" : "border-violet-200"}
                />
                {errors.descripcion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Observación <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, observacion: value })
                    setErrors({ ...errors, observacion: false })
                  }}
                  value={formData.observacion}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.observacion ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione una observación" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {observacionOptions.map((observacion, index) => (
                      <SelectItem
                        key={`observacion-${index}`}
                        value={observacion}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {observacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.observacion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Nivel probabilidad <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, nivelProbabilidad: value })
                    setErrors({ ...errors, nivelProbabilidad: false })
                  }}
                  value={formData.nivelProbabilidad}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.nivelProbabilidad ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {probList
                      .filter((nivel) => nivel && nivel.level !== undefined) // Filtrar elementos válidos
                      .map((nivel, index) => (
                        <SelectItem
                          key={`prob-${nivel.level}-${index}`}
                          value={nivel.level.toString()}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {nivel.description || "Sin descripción"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.nivelProbabilidad && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Nivel impacto <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, nivelImpacto: value })
                    setErrors({ ...errors, nivelImpacto: false })
                  }}
                  value={formData.nivelImpacto}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.nivelImpacto ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un nivel" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {impactList
                      .filter((nivel) => nivel && nivel.level !== undefined) // Filtrar elementos válidos
                      .map((nivel, index) => (
                        <SelectItem
                          key={`impact-${nivel.level}-${index}`}
                          value={nivel.level.toString()}
                          className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                        >
                          {nivel.description || "Sin descripción"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.nivelImpacto && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Efectividad del control <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, efectividadControl: value })
                    setErrors({ ...errors, efectividadControl: false })
                  }}
                  value={formData.efectividadControl}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.efectividadControl ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione efectividad" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {efectyControl.map((efectividad, index) => (
                      <SelectItem
                        key={`efectividad-${index}`}
                        value={efectividad}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {efectividad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.efectividadControl && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Estado del control <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, estadoControl: value })
                    setErrors({ ...errors, estadoControl: false })
                  }}
                  value={formData.estadoControl}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.estadoControl ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {stateControl.map((estado, index) => (
                      <SelectItem
                        key={`estado-control-${index}`}
                        value={estado}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estadoControl && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Estado de la evaluación <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, estadoEvaluacion: value })
                    setErrors({ ...errors, estadoEvaluacion: false })
                  }}
                  value={formData.estadoEvaluacion}
                >
                  <SelectTrigger
                    className={`p-2 bg-white text-black rounded-md border ${
                      errors.estadoEvaluacion ? "border-red-500" : "border-violet-200"
                    }`}
                  >
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                    {stateEvaluation.map((estado, index) => (
                      <SelectItem
                        key={`estado-evaluacion-${index}`}
                        value={estado}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estadoEvaluacion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-violet-900 text-white">
                {isLoading ? "Procesando..." : editingId ? "Actualizar Evaluación" : "Registrar Evaluación"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="text-violet-600 border-violet-600"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-lg border-t-4 border-orange-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-orange-900">Listado de Evaluaciones</h2>
            <ExportButtons data={evaluations} fileName="listado-evaluaciones" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Evento Riesgo</TableHead>
                  <TableHead className="bg-violet-50">Control</TableHead>
                  <TableHead className="bg-violet-50">Fecha evaluación</TableHead>
                  <TableHead className="bg-violet-50">Descripción</TableHead>
                  <TableHead className="bg-violet-50">Nivel probabilidad</TableHead>
                  <TableHead className="bg-violet-50">Nivel impacto</TableHead>
                  <TableHead className="bg-violet-50">Efectividad control</TableHead>
                  <TableHead className="bg-violet-50">Estado control</TableHead>
                  <TableHead className="bg-violet-50">Estado evaluación</TableHead>
                  <TableHead className="bg-violet-50">Próxima evaluación</TableHead>
                  <TableHead className="bg-violet-50">Observación</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations
                  .filter((evaluation) => evaluation && evaluation.id) // Filtrar elementos válidos
                  .map((evaluation, index) => (
                    <TableRow key={`evaluation-${evaluation.id || index}`} className="hover:bg-violet-50">
                      <TableCell>{getRiskDescription(evaluation.idEvento)}</TableCell>
                      <TableCell>{getControlDescription(evaluation.idControl)}</TableCell>
                      <TableCell>
                        {evaluation.fechaEvaluacion
                          ? new Date(evaluation.fechaEvaluacion).toLocaleDateString("es-CO")
                          : ""}
                      </TableCell>
                      <TableCell>{evaluation.descripcion}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getNivelColor(evaluation.nivelProbabilidad),
                          )}
                        >
                          {getProbabilityDescription(evaluation.nivelProbabilidad)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getNivelColor(evaluation.nivelImpacto),
                          )}
                        >
                          {getImpactDescription(evaluation.nivelImpacto)}
                        </span>
                      </TableCell>
                      <TableCell>{evaluation.efectividadControl}</TableCell>
                      <TableCell>{evaluation.estadoControl}</TableCell>
                      <TableCell>{evaluation.estadoEvaluacion}</TableCell>
                      <TableCell>
                        {evaluation.fechaProximaEvaluacion
                          ? new Date(evaluation.fechaProximaEvaluacion).toLocaleDateString("es-CO")
                          : ""}
                      </TableCell>
                      <TableCell>{evaluation.observacion}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-violet-600 border-violet-600 h-8 w-8 p-0"
                            onClick={() => handleEdit(evaluation)}
                          >
                            <Edit3 className="w-4 h-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 h-8 w-8 p-0"
                            onClick={() => handleDelete(evaluation.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
