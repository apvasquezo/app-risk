"use client"

import type React from "react"

import { useState } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui_prueba/card"
import { Input } from "@/components/ui_prueba/input"
import { Button } from "@/components/ui_prueba/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui_prueba/table"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui_prueba/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui_prueba/label"
import { ExportButtons } from "@/components/ui_prueba/export-buttons"

interface ControlEvaluation {
  id: string
  idControl: string
  idEvento: string
  fechaEvaluacion: string
  nivelProbabilidad: string
  nivelImpacto: string
  responsableEvaluacion: string
  fechaProximaEvaluacion: string
  observacion: string
}

// Opciones para los selectores
const nivelProbabilidadOptions = ["Bajo", "Medio", "Alto", "Muy Alto", "Crítico"]
const nivelImpactoOptions = ["Bajo", "Medio", "Alto", "Muy Alto", "Crítico"]
const observacionOptions = ["Registro Evento Primera vez", "Primera evaluacion"]

export default function ControlEvaluationForm() {
  const { toast } = useToast()

  const [formData, setFormData] = useState<ControlEvaluation>({
    id: "",
    idControl: "",
    idEvento: "",
    fechaEvaluacion: "",
    nivelProbabilidad: "",
    nivelImpacto: "",
    responsableEvaluacion: "",
    fechaProximaEvaluacion: "",
    observacion: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  const [errors, setErrors] = useState({
    idControl: false,
    idEvento: false,
    fechaEvaluacion: false,
    nivelProbabilidad: false,
    nivelImpacto: false,
    responsableEvaluacion: false,
    fechaProximaEvaluacion: false,
    observacion: false,
  })

  const [evaluations, setEvaluations] = useState<ControlEvaluation[]>([
    {
      id: "1",
      idControl: "CTRL-001",
      idEvento: "EV-001",
      fechaEvaluacion: "2025-05-10T09:00",
      nivelProbabilidad: "Medio",
      nivelImpacto: "Alto",
      responsableEvaluacion: "Ana Martínez",
      fechaProximaEvaluacion: "2025-08-10T09:00",
      observacion: "Primera evaluacion",
    },
  ])

  const validateForm = () => {
    const newErrors = {
      idControl: !formData.idControl.trim(),
      idEvento: !formData.idEvento.trim(),
      fechaEvaluacion: !formData.fechaEvaluacion.trim(),
      nivelProbabilidad: !formData.nivelProbabilidad.trim(),
      nivelImpacto: !formData.nivelImpacto.trim(),
      responsableEvaluacion: !formData.responsableEvaluacion.trim(),
      fechaProximaEvaluacion: !formData.fechaProximaEvaluacion.trim(),
      observacion: !formData.observacion.trim(),
    }

    // Validación adicional: fecha próxima evaluación debe ser posterior a fecha evaluación
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
  }

  const resetForm = () => {
    setFormData({
      id: "",
      idControl: "",
      idEvento: "",
      fechaEvaluacion: "",
      nivelProbabilidad: "",
      nivelImpacto: "",
      responsableEvaluacion: "",
      fechaProximaEvaluacion: "",
      observacion: "",
    })
    setEditingId(null)
    setErrors({
      idControl: false,
      idEvento: false,
      fechaEvaluacion: false,
      nivelProbabilidad: false,
      nivelImpacto: false,
      responsableEvaluacion: false,
      fechaProximaEvaluacion: false,
      observacion: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son obligatorios.",
      })
      return
    }

    try {
      if (editingId) {
        setEvaluations(
          evaluations.map((evaluation) => (evaluation.id === editingId ? { ...formData, id: editingId } : evaluation)),
        )
        toast({
          title: "Evaluación actualizada",
          description: "La evaluación ha sido actualizada exitosamente.",
        })
      } else {
        const newEvaluation = { ...formData, id: Date.now().toString() }
        setEvaluations([...evaluations, newEvaluation])
        toast({
          title: "Evaluación registrada",
          description: "La nueva evaluación ha sido registrada exitosamente.",
        })
      }
      resetForm()
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      })
    }
  }

  const handleEdit = (evaluation: ControlEvaluation) => {
    setFormData(evaluation)
    setEditingId(evaluation.id)
  }

  const handleDelete = (id: string) => {
    setEvaluations(evaluations.filter((evaluation) => evaluation.id !== id))
    toast({
      title: "Evaluación eliminada",
      description: "La evaluación ha sido eliminada exitosamente.",
    })
    if (editingId === id) resetForm()
  }

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
                  ID Control <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  placeholder="Ingrese el ID del control"
                  value={formData.idControl}
                  onChange={(e) => {
                    setFormData({ ...formData, idControl: e.target.value })
                    setErrors({ ...errors, idControl: false })
                  }}
                  className={errors.idControl ? "border-red-500" : "border-violet-200"}
                />
                {errors.idControl && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  ID Evento <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  placeholder="Ingrese el ID del evento"
                  value={formData.idEvento}
                  onChange={(e) => {
                    setFormData({ ...formData, idEvento: e.target.value })
                    setErrors({ ...errors, idEvento: false })
                  }}
                  className={errors.idEvento ? "border-red-500" : "border-violet-200"}
                />
                {errors.idEvento && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha evaluación <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
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
                  type="datetime-local"
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
                    {nivelProbabilidadOptions.map((nivel) => (
                      <SelectItem
                        key={nivel}
                        value={nivel}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {nivel}
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
                    {nivelImpactoOptions.map((nivel) => (
                      <SelectItem
                        key={nivel}
                        value={nivel}
                        className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                      >
                        {nivel}
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
                  Responsable evaluación <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  placeholder="Ingrese el responsable"
                  value={formData.responsableEvaluacion}
                  onChange={(e) => {
                    setFormData({ ...formData, responsableEvaluacion: e.target.value })
                    setErrors({ ...errors, responsableEvaluacion: false })
                  }}
                  className={errors.responsableEvaluacion ? "border-red-500" : "border-violet-200"}
                />
                {errors.responsableEvaluacion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
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
                    {observacionOptions.map((observacion) => (
                      <SelectItem
                        key={observacion}
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

            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Evaluación" : "Registrar Evaluación"}
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
                  <TableHead className="bg-violet-50">ID Control</TableHead>
                  <TableHead className="bg-violet-50">ID Evento</TableHead>
                  <TableHead className="bg-violet-50">Fecha evaluación</TableHead>
                  <TableHead className="bg-violet-50">Nivel probabilidad</TableHead>
                  <TableHead className="bg-violet-50">Nivel impacto</TableHead>
                  <TableHead className="bg-violet-50">Responsable</TableHead>
                  <TableHead className="bg-violet-50">Próxima evaluación</TableHead>
                  <TableHead className="bg-violet-50">Observación</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id} className="hover:bg-violet-50">
                    <TableCell>{evaluation.idControl}</TableCell>
                    <TableCell>{evaluation.idEvento}</TableCell>
                    <TableCell>
                      {evaluation.fechaEvaluacion ? new Date(evaluation.fechaEvaluacion).toLocaleString("es-CO") : ""}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getNivelColor(evaluation.nivelProbabilidad),
                        )}
                      >
                        {evaluation.nivelProbabilidad}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getNivelColor(evaluation.nivelImpacto),
                        )}
                      >
                        {evaluation.nivelImpacto}
                      </span>
                    </TableCell>
                    <TableCell>{evaluation.responsableEvaluacion}</TableCell>
                    <TableCell>
                      {evaluation.fechaProximaEvaluacion
                        ? new Date(evaluation.fechaProximaEvaluacion).toLocaleString("es-CO")
                        : ""}
                    </TableCell>
                    <TableCell>{evaluation.observacion}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(evaluation)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(evaluation.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
