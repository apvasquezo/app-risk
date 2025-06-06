"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { transformControls } from "@/lib/transformers"
import { transformTypeControl } from "@/lib/transformers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/axios"

interface Control {
  id: string
  tipoControl: string //id del tipo de control
  control: string //nombre tipo de control
  descripcion: string
  frecuencia: string
  responsable: string
}

interface TypeControl {
  id: number
  description: string
}

// Opciones de frecuencia definidas
const frecuenciaOptions = ["Diaria", "Semanal", "Quincenal", "Mensual", "Bimestral", "Trimestral", "Semestral", "Anual"]

export default function Controls() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    control: "",
    descripcion: "",
    frecuencia: "",
    responsable: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    control: false,
    descripcion: false,
    frecuencia: false,
    responsable: false,
  })
  const [controlList, setControlList] = useState<Control[]>([])
  const [typeList, setTypeList] = useState<TypeControl[]>([])

  const mapTypeIdToName = (typeId: number, typeList: TypeControl[]): string => {
    const type = typeList.find((type) => type.id === typeId)
    return type ? type.description : "Tipo de control no encontrado"
  }

  const mapTypeNameToId = (typeName: string, typeList: TypeControl[]): number => {
    const type = typeList.find((type) => type.description === typeName)
    return type ? type.id : 0
  }

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const responseTypes = await api.get("/risk-control-types")
        const transformedTypes = transformTypeControl(responseTypes.data)
        setTypeList(transformedTypes)

        const responseControl = await api.get("/controls")
        const transformedControl = transformControls(responseControl.data)

        const controlWithTypeNames = transformedControl.map((control) => ({
          ...control,
          control: mapTypeIdToName(Number(control.tipoControl), transformedTypes),
        }))
        setControlList(controlWithTypeNames)
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
      frecuencia: !formData.frecuencia.trim(),
      responsable: !formData.responsable.trim(),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const resetForm = () => {
    setFormData({
      control: "",
      descripcion: "",
      frecuencia: "",
      responsable: "",
    })
    setEditingId(null)
    setErrors({
      control: false,
      descripcion: false,
      frecuencia: false,
      responsable: false,
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
      // Convertir el nombre del tipo de control a ID
      const controlTypeId = mapTypeNameToId(formData.control, typeList)

      const payload = {
        control_type_id: controlTypeId.toString(),
        description: formData.descripcion,
        frequency: formData.frecuencia,
        responsible_id: formData.responsable,
      }

      if (editingId) {
        await api.put(`/controls/${editingId}`, payload)

        setControlList((prev) =>
          prev.map((control) =>
            control.id === editingId
              ? {
                  ...control,
                  descripcion: formData.descripcion,
                  frecuencia: formData.frecuencia,
                  responsable: formData.responsable,
                  tipoControl: controlTypeId.toString(),
                  control: formData.control, // nombre del tipo de control
                }
              : control,
          ),
        )

        toast({
          title: "Control actualizado",
          description: "El control ha sido actualizado exitosamente.",
        })
      } else {
        const response = await api.post("/controls", payload)

        const newControl = {
          id: response.data.id_control.toString(),
          tipoControl: controlTypeId.toString(),
          descripcion: payload.description,
          frecuencia: payload.frequency,
          responsable: payload.responsible_id,
          control: formData.control, // nombre del tipo de control
        }

        setControlList((prev) => [...prev, newControl])

        toast({
          title: "Control registrado",
          description: "El nuevo control ha sido registrado exitosamente.",
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
    }
  }

  const handleEdit = (control: Control) => {
    setFormData({
      control: control.control, // usar el nombre del tipo, no el ID
      descripcion: control.descripcion,
      frecuencia: control.frecuencia,
      responsable: control.responsable,
    })
    setEditingId(control.id)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás segura de que deseas eliminar este control?")
    if (!confirmDelete) return
    try {
      await api.delete(`/controls/${id}`)

      setControlList((prev) => prev.filter((control) => control.id !== id))

      toast({
        title: "Control eliminado",
        description: "El control ha sido eliminado exitosamente.",
      })

      if (editingId === id) resetForm()
    } catch (error) {
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
          <h1 className="text-3xl font-bold text-violet-900">Gestión de Controles</h1>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-violet-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Tipo de Control <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.control}
                onValueChange={(value) => {
                  setFormData({ ...formData, control: value })
                  setErrors({ ...errors, control: false })
                }}
              >
                <SelectTrigger
                  className={`w-full rounded-md p-2 bg-white text-black  ${errors.control ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccione un tipo de control" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md ">
                  {typeList.map((tipo) => (
                    <SelectItem key={tipo.id} 
                    value={tipo.description}
                    className="hover:bg-violet-100 focus:bg-violet-200">
                      {tipo.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.control && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese la descripción del control"
                value={formData.descripcion}
                onChange={(e) => {
                  setFormData({ ...formData, descripcion: e.target.value })
                  setErrors({ ...errors, descripcion: false })
                }}
                className={`border-violet-200 focus:ring-violet-500 ${errors.descripcion ? "border-red-500" : ""}`}
              />
              {errors.descripcion && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Frecuencia <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.frecuencia}
                onValueChange={(value) => {
                  setFormData({ ...formData, frecuencia: value })
                  setErrors({ ...errors, frecuencia: false })
                }}
              >
                <SelectTrigger
                  className={`w-full rounded-md p-2 bg-white !bg-opacity-100 text-black border-violet-200 focus:ring-violet-500 ${errors.frecuencia ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Seleccione una frecuencia" />
                </SelectTrigger>
                <SelectContent className="bg-white !bg-opacity-100 shadow-md border border-gray-200 rounded-md text-black">
                  {frecuenciaOptions.map((freq) => (
                    <SelectItem key={freq} value={freq}
                    className="hover:bg-violet-100 focus:bg-violet-200">
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.frecuencia && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-700">
                Responsable <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ingrese ID persona responsable"
                value={formData.responsable}
                onChange={(e) => {
                  setFormData({ ...formData, responsable: e.target.value })
                  setErrors({ ...errors, responsable: false })
                }}
                className={`border-violet-200 focus:ring-violet-500 ${errors.responsable ? "border-red-500" : ""}`}
              />
              {errors.responsable && <p className="text-sm text-red-500">Este campo es obligatorio</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-violet-900 text-white">
                {editingId ? "Actualizar Control" : "Registrar Control"}
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
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">Listado de Controles</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-violet-50">Tipo de Control</TableHead>
                <TableHead className="bg-violet-50">Descripción</TableHead>
                <TableHead className="bg-violet-50">Frecuencia</TableHead>
                <TableHead className="bg-violet-50">Responsable</TableHead>
                <TableHead className="bg-violet-50">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controlList.map((control) => (
                <TableRow key={control.id} className="hover:bg-violet-50">
                  <TableCell>{control.control}</TableCell>
                  <TableCell>{control.descripcion}</TableCell>
                  <TableCell>{control.frecuencia}</TableCell>
                  <TableCell>{control.responsable}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-violet-600 border-violet-600"
                        onClick={() => handleEdit(control)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                        onClick={() => handleDelete(control.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
