"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { transformControls } from "@/lib/transformers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import api from "@/lib/axios"

interface ActionPlan {
  id_plan: string
  control_id: string
  control:string //nombre del
  descripcion: string
  fechaInicial: string
  fechaFinal: string
  responsable: string
  estado: string
}

interface Control {
  id: string
  tipoControl: string //id del tipo de control
  control: string //nombre tipo de control
  descripcion: string
  frecuencia: string
  responsable: string
}

const estadoOptions = ["Pendiente", "En progreso", "Completado", "Cancelado", "Retrasado"]

export default function ActionPlanForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    control: "",
    descripcion: "",
    fechaInicial: "",
    fechaFinal: "",
    responsable: "",
    estado: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    control: false,
    descripcion: false,
    fechaInicial: false,
    fechaFinal: false,
    responsable: false,
    estado: false,
  })
  const [planList, setPlanList] = useState<ActionPlan[]>([])
  const [controlList, setControlList] = useState<Control[]>([])
 
  const mapControlIdToName = (typeId: string, typeList: Control[]): string => {
    const type = typeList.find((type) => type.id === typeId)
    return type ? type.descripcion : "Control no encontrado"
  }
  const mapControlNameToId = (typeName: string, typeList: Control[]): number => {
    const type = typeList.find((type) => type.descripcion === typeName)
    return type ? type.id : 0
  }

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const responseControl = await api.get("/controls")
        console.log("que llega en ", responseControl)
        const transformedControl = transformControls(responseControl.data)        
        console.log("que transdorma control ", transformedControl)
        setControlList(transformedControl)

        const responsePlan = await api.get("/plans")
        
        const transformedPlan = transforPlan(responsePlan.data)
        
        setPlanist(transformedPlan)
        const controlWithNames = transformedControl.map((control) => ({
          ...control,
          control: mapControlIdToName(control.tipoControl, transformedControl),
        }))
        setControlList(controlWithNames)
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Error al cargar tipos de controles",
          description: "No se pudo obtener el listado de tipos de controles desde el servidor.",
        })
      }
    }
    fetchControls()
  }, [toast])



  const validateForm = () => {
    const newErrors = {
      control: !formData.control.trim(),
      descripcion: !formData.descripcion.trim(),
      fechaInicial: !formData.fechaInicial.trim(),
      fechaFinal: !formData.fechaFinal.trim(),
      responsable: !formData.responsable.trim(),
      estado: !formData.estado.trim(),
    }

    // Validación adicional: fecha final debe ser posterior a fecha inicial
    let fechasValidas = true
    if (formData.fechaInicial && formData.fechaFinal) {
      if (new Date(formData.fechaFinal) < new Date(formData.fechaInicial)) {
        toast({
          variant: "destructive",
          title: "Error de validación",
          description: "La fecha final debe ser posterior a la fecha inicial.",
        })
        fechasValidas = false
      }
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error) && fechasValidas
  }

  const resetForm = () => {
    setFormData({
      control: "",
      descripcion: "",
      fechaInicial: "",
      fechaFinal: "",
      responsable: "",
      estado: "",
    })
    setEditingId(null)
    setErrors({
      control: false,
      descripcion: false,
      fechaInicial: false,
      fechaFinal: false,
      responsable: false,
      estado: false,
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
      const controlId = mapControlNameToId(formData.control, controlList)
      const payload = {
        description: formData.descripcion,
        star_date: formData.fechaFinal,
        end_date: formData.fechaFinal,
        personal_id: formData.responsable,
        state: formData.estado,        
      }
      if (editingId) {
        await api.put(`/plans/${editingId}`, payload)
        setPlanList((prev) =>
          prev.map((plan) => plan.id_plan === editingId 
          ? { 
            ...plan,
              control_id:controlId.toString(),
              control: formData.control,
              descripcion: formData.descripcion,
              fechaInicial: formData.fechaFinal,
              fechaFinal: formData.fechaFinal,
              responsable: formData.responsable,
              estado: formData.estado,              
            } : plan,
          ),
        )

        toast({
          title: "Plan de acción actualizado",
          description: "El plan de acción ha sido actualizado exitosamente.",
        })
      } else {
        const response = await api.post("/plans", payload)

        const newPlan = { 
          id_plan:response.data.id_plan.toString(),
          control_id:controlId.toString(),
          descripcion:payload.description,
          fechaInicial: payload.star_date,
          fechafinal: payload.end_date,
          estado: payload.state,          
        }
        setPlanList((prev) => [...prev, newPlan])
        toast({
          title: "Plan de acción registrado",
          description: "El nuevo plan de acción ha sido registrado exitosamente.",
        })
      }
      resetForm()
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      })
    }
  }

  const handleEdit = (plan: ActionPlan) => {
    setFormData(plan)
    setEditingId(plan.id_plan)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este Plan?")
    if (!confirmDelete) return 
    try {
      await api.delete(`/plans/${id}`)
    setPlanList(planList.filter((plan) => plan.id_plan !== id))
    toast({
      title: "Plan de acción eliminado",
      description: "El plan de acción ha sido eliminado exitosamente.",
    })
    if (editingId === id) resetForm()

    } catch (error)  {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el control.",
      })
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Planes de Acción</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-violet-700">
                Control <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, control: value })
                  setErrors({ ...errors, control: false })
                }}
                value={formData.control}
              >
                <SelectTrigger
                  className={`p-2 bg-white text-black rounded-md border ${
                    errors.control ? "border-red-500" : "border-violet-200"
                  }`}
                >
                  <SelectValue placeholder="Seleccione un control" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                  {controlOptions.map((control) => (
                    <SelectItem
                      key={control}
                      value={control}
                      className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                    >
                      {control}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.control && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-violet-700">
                Descripción de la acción <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                placeholder="Ingrese la descripción de la acción"
                value={formData.descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, descripcion: e.target.value })
                  setErrors({ ...errors, descripcion: false })
                }}
                className={errors.descripcion ? "border-red-500" : "border-violet-200"}
              />
              {errors.descripcion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha inicial <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaInicial}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaInicial: e.target.value })
                    setErrors({ ...errors, fechaInicial: false })
                  }}
                  className={errors.fechaInicial ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaInicial && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-violet-700">
                  Fecha final <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.fechaFinal}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaFinal: e.target.value })
                    setErrors({ ...errors, fechaFinal: false })
                  }}
                  className={errors.fechaFinal ? "border-red-500" : "border-violet-200"}
                />
                {errors.fechaFinal && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-violet-700">
                Responsable <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                placeholder="Ingrese el área o persona responsable"
                value={formData.responsable}
                onChange={(e) => {
                  setFormData({ ...formData, responsable: e.target.value })
                  setErrors({ ...errors, responsable: false })
                }}
                className={errors.responsable ? "border-red-500" : "border-violet-200"}
              />
              {errors.responsable && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-violet-700">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, estado: value })
                  setErrors({ ...errors, estado: false })
                }}
                value={formData.estado}
              >
                <SelectTrigger
                  className={`p-2 bg-white text-black rounded-md border ${
                    errors.estado ? "border-red-500" : "border-violet-200"
                  }`}
                >
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md rounded-lg">
                  {estadoOptions.map((estado) => (
                    <SelectItem
                      key={estado}
                      value={estado}
                      className="hover:bg-violet-100 focus:bg-violet-200 text-black"
                    >
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.estado && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Plan" : "Registrar Plan"}
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
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Planes de Acción</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-violet-50">Control</TableHead>
                  <TableHead className="bg-violet-50">Descripción</TableHead>
                  <TableHead className="bg-violet-50">Fecha inicial</TableHead>
                  <TableHead className="bg-violet-50">Fecha final</TableHead>
                  <TableHead className="bg-violet-50">Responsable</TableHead>
                  <TableHead className="bg-violet-50">Estado</TableHead>
                  <TableHead className="bg-violet-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionPlans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-violet-50">
                    <TableCell>{plan.control}</TableCell>
                    <TableCell>{plan.descripcion}</TableCell>
                    <TableCell>
                      {plan.fechaInicial ? new Date(plan.fechaInicial).toLocaleString("es-CO") : ""}
                    </TableCell>
                    <TableCell>{plan.fechaFinal ? new Date(plan.fechaFinal).toLocaleString("es-CO") : ""}</TableCell>
                    <TableCell>{plan.responsable}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          plan.estado === "Completado" && "bg-green-100 text-green-800",
                          plan.estado === "En progreso" && "bg-blue-100 text-blue-800",
                          plan.estado === "Pendiente" && "bg-yellow-100 text-yellow-800",
                          plan.estado === "Cancelado" && "bg-red-100 text-red-800",
                          plan.estado === "Retrasado" && "bg-orange-100 text-orange-800",
                        )}
                      >
                        {plan.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-violet-600 border-violet-600"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                          onClick={() => handleDelete(plan.id)}
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
